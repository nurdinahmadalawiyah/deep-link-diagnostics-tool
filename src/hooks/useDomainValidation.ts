import { useState } from 'react';
import { ValidationResult } from '@/lib/validation/validator';

export interface ValidationResponse {
  ios: ValidationResult | null;
  android: ValidationResult | null;
}

export function useDomainValidation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResponse | null>(null);
  const [domain, setDomain] = useState<string>('');

  const validateDomain = async (inputDomain: string, platforms: ('ios' | 'android')[] = ['ios', 'android']) => {
    setIsLoading(true);
    setError(null);
    setDomain(inputDomain);

    try {
      if (!inputDomain.trim()) {
        throw new Error("Please enter a valid domain.");
      }

      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: inputDomain, platforms }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP Error ${res.status}`);
      }

      const data: ValidationResponse = await res.json();
      setValidationResults(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while validating the domain.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    validationResults,
    validateDomain,
    domain,
  };
}
