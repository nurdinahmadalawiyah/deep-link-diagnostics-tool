import Ajv from "ajv";
import addFormats from "ajv-formats";
import { appleAasaSchema, androidAssetLinksSchema } from "./schemas";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validateAasa = ajv.compile(appleAasaSchema);
const validateAssetLinks = ajv.compile(androidAssetLinksSchema);

export interface ValidationResult {
  status: "success" | "error";
  message: string;
  data?: any;
  errors?: any[];
  expectedVsActual?: {
    expected: string;
    actual: string;
  };
  cdnData?: any;
  cdnStatus?: "success" | "error" | "not_found";
  cdnMessage?: string;
}

export async function validateDomainFiles(
  domain: string,
  platforms: ("ios" | "android")[] = ["ios", "android"]
): Promise<{
  ios: ValidationResult | null;
  android: ValidationResult | null;
}> {
  // Normalize domain
  let baseUrl = domain.trim();
  if (!baseUrl.startsWith("http")) {
    baseUrl = `https://${baseUrl}`;
  }
  
  // Remove trailing slashes
  baseUrl = baseUrl.replace(/\/+$/, "");
  
  const rawDomain = baseUrl.replace(/^https?:\/\//, "");

  const promises: Promise<ValidationResult | null>[] = [];

  if (platforms.includes("ios")) {
    promises.push(
      fetchAndValidate(`${baseUrl}/.well-known/apple-app-site-association`, "ios", `https://app-site-association.cdn-apple.com/a/v1/${rawDomain}`)
    );
  } else {
    promises.push(Promise.resolve(null));
  }

  if (platforms.includes("android")) {
    promises.push(
      fetchAndValidate(`${baseUrl}/.well-known/assetlinks.json`, "android", `https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=${baseUrl}&relation=delegate_permission/common.handle_all_urls`)
    );
  } else {
    promises.push(Promise.resolve(null));
  }

  const [ios, android] = await Promise.all(promises);

  return { ios, android };
}

async function fetchAndValidate(url: string, platform: "ios" | "android", cdnUrl?: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    status: "error",
    message: "Failed to fetch.",
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      redirect: "manual" // To catch 301/302 redirects
    });

    if (response.status >= 300 && response.status < 400) {
      result.message = `Redirects are not allowed. Received HTTP ${response.status}.`;
    } else if (response.status !== 200) {
      result.message = `Failed to fetch. HTTP Status: ${response.status}`;
    } else {
      const contentType = response.headers.get("content-type") || "";
      let contentTypeWarning = "";
      if (!contentType.includes("application/json") && !contentType.includes("text/json")) {
        contentTypeWarning = ` (Warning: Invalid Content-Type. Expected 'application/json', got '${contentType}')`;
      }

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        result.data = data;
        
        const validate = platform === "ios" ? validateAasa : validateAssetLinks;
        const isValid = validate(data);

        if (!isValid) {
          result.message = "JSON does not match the official schema." + contentTypeWarning;
          result.errors = validate.errors || undefined;
        } else if (contentTypeWarning) {
          // If JSON is valid but Content-Type is wrong, it's still technically an error for Apple/Google
          result.status = "error";
          result.message = "JSON is structurally valid, but the server returned an incorrect Content-Type." + contentTypeWarning;
        } else {
          result.status = "success";
          result.message = "Valid configuration found.";
        }
      } catch (e) {
        result.message = "Invalid JSON format." + contentTypeWarning;
        result.expectedVsActual = {
          expected: "{\n  \"applinks\": { ... } // for iOS\n  // or array for Android\n}",
          actual: text,
        };
      }
    }
  } catch (error: any) {
    result.message = `Network error: ${error.message || "Could not reach the domain"}`;
  }

  // Fetch CDN Data if requested
  if (cdnUrl) {
    try {
      const cdnResponse = await fetch(cdnUrl, { method: "GET", cache: "no-store" });
      if (cdnResponse.status === 200) {
        const cdnText = await cdnResponse.text();
        result.cdnData = JSON.parse(cdnText);
        result.cdnStatus = "success";
        result.cdnMessage = "Successfully fetched from CDN/API.";
      } else if (cdnResponse.status === 404) {
        result.cdnStatus = "not_found";
        result.cdnMessage = "Not found in CDN cache. The bot may not have scraped your site yet.";
      } else {
        result.cdnStatus = "error";
        result.cdnMessage = `CDN returned HTTP ${cdnResponse.status}.`;
      }
    } catch (e: any) {
      result.cdnStatus = "error";
      result.cdnMessage = `Failed to reach CDN: ${e.message}`;
    }
  }

  return result;
}
