/**
 * API Base URL Helper
 * Reads VITE_API_BASE_URL from environment variables.
 * In development, defaults to '' (same origin proxy) or backend port 5000 if set.
 */
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
