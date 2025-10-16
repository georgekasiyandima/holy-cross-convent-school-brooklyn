// Centralized API configuration
// Uses environment variables in production and sensible defaults in development

const envApiBase =
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE_URL) ||
  (typeof window !== 'undefined' && (window as any).__API_BASE_URL__) ||
  '';

// Default dev and fallback production base URLs
const defaultDevBase = 'http://localhost:5000';
const defaultProdBase = 'https://holy-cross-convent-school-brooklyn.onrender.com';

// Determine base URL
const resolvedBase = (envApiBase || (process.env.NODE_ENV === 'production' ? defaultProdBase : defaultDevBase)).replace(/\/$/, '');

export const API_BASE_URL = resolvedBase;
export const API_BASE_URL_WITH_PREFIX = `${API_BASE_URL}/api`;

export default {
  API_BASE_URL,
  API_BASE_URL_WITH_PREFIX,
};


