export const appleAasaSchema = {
  type: "object",
  properties: {
    applinks: {
      type: "object",
      properties: {
        apps: { type: "array" },
        details: {
          type: "array",
          items: {
            type: "object",
            properties: {
              appID: { type: "string" },
              appIDs: { type: "array", items: { type: "string" } },
              paths: { type: "array", items: { type: "string" } },
              components: { type: "array", items: { type: "object" } },
            },
            anyOf: [
              { required: ["appID", "paths"] },
              { required: ["appIDs", "components"] },
            ],
          },
        },
      },
      required: ["details"],
    },
    webcredentials: { type: "object" },
    appclips: { type: "object" },
  },
  required: ["applinks"],
  additionalProperties: true,
};

export const androidAssetLinksSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      relation: { type: "array", items: { type: "string" } },
      target: {
        type: "object",
        properties: {
          namespace: { type: "string", enum: ["android_app"] },
          package_name: { type: "string" },
          sha256_cert_fingerprints: {
            type: "array",
            items: {
              type: "string",
              pattern: "^([0-9A-Fa-f]{2}:){31}[0-9A-Fa-f]{2}$",
            },
          },
        },
        required: ["namespace", "package_name", "sha256_cert_fingerprints"],
      },
    },
    required: ["relation", "target"],
  },
};
