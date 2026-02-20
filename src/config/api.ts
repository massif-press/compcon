/**
 * Centralized API configuration module
 * All API base URLs are loaded from environment variables with fallback defaults
 */

interface ApiConfig {
  userApi: string
  contentApi: string
  extraContentApi: string
}

const getApiConfig = (): ApiConfig => {
  // Get base URLs from environment variables with fallback defaults
  const userApi =
    import.meta.env.VITE_USER_API_BASE_URL ||
    'https://ai5fg19zme.execute-api.us-east-1.amazonaws.com/prod'
  const contentApi =
    import.meta.env.VITE_CONTENT_API_BASE_URL ||
    'https://jefxcgrkd0.execute-api.us-east-1.amazonaws.com/prod'
  const extraContentApi =
    import.meta.env.VITE_EXTRA_CONTENT_API_BASE_URL ||
    'https://ujgatmvzlg.execute-api.us-east-1.amazonaws.com/prod'

  return {
    userApi,
    contentApi,
    extraContentApi,
  }
}

export const API_CONFIG = getApiConfig()

// Individual exports for convenience
export const USER_API_BASE_URL = API_CONFIG.userApi
export const CONTENT_API_BASE_URL = API_CONFIG.contentApi
export const EXTRA_CONTENT_API_BASE_URL = API_CONFIG.extraContentApi
