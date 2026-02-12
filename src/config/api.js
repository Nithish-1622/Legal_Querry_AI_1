// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8003';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;

// API Endpoints
export const API_ENDPOINTS = {
  QUERY: `${API_BASE_URL}/query`,
  UPLOAD_DOCUMENT: `${API_BASE_URL}/upload-document`,
  HEALTH: `${API_BASE_URL}/health`,
  SEARCH: `${API_BASE_URL}/search`,
};

// API Client Configuration
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// API Client class
export class LegalQueryAPIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = API_TIMEOUT;
  }

  async makeRequest(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(endpoint, {
        ...options,
        signal: controller.signal,
        headers: {
          ...apiConfig.headers,
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection');
      }
      
      throw error;
    }
  }

  async queryLegal(question) {
    return this.makeRequest(API_ENDPOINTS.QUERY, {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  }

  async uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);

    return this.makeRequest(API_ENDPOINTS.UPLOAD_DOCUMENT, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
      },
    });
  }

  async checkHealth() {
    return this.makeRequest(API_ENDPOINTS.HEALTH);
  }

  async search(query) {
    return this.makeRequest(`${API_ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`);
  }
}

// Create a singleton instance
export const apiClient = new LegalQueryAPIClient();

// Error handling utility
export const handleAPIError = (error) => {
  console.error('API Error:', error);
  
  if (error.message.includes('timeout')) {
    return 'Request timed out. Please check your connection and try again.';
  }
  
  if (error.message.includes('Failed to fetch')) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  if (error.message.includes('HTTP 4')) {
    return 'Invalid request. Please check your input and try again.';
  }
  
  if (error.message.includes('HTTP 5')) {
    return 'Server error. Please try again later.';
  }
  
  return error.message || 'An unexpected error occurred. Please try again.';
};

export default apiClient;