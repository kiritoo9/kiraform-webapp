export async function apiCall(endpoint: string, options: RequestInit = {}) {
    try {
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Network error' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        if (response?.status === 204) return true;
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};