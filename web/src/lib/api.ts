// API service for communicating with Go backend
const API_BASE_URL = 'http://localhost:8080/api';

export interface Business {
    id: number;
    name: string;
    category: string;
    sub_category: string;
    address: string;
    city: string;
    country: string;
    postal_code: string;
    latitude: number;
    longitude: number;
    phone: string;
    website: string;
    email: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface BusinessResponse {
    success: boolean;
    count: number;
    businesses: Business[];
    filters: {
        category?: string;
        city?: string;
        subcategory?: string;
    };
}

// Get all businesses with optional filters
export async function getBusinesses(filters?: {
    category?: string;
    city?: string;
    subcategory?: string;
}): Promise<BusinessResponse> {
    const params = new URLSearchParams();

    if (filters?.category) params.append('category', filters.category);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.subcategory) params.append('subcategory', filters.subcategory);

    const url = `${API_BASE_URL}/businesses${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch businesses');
    }

    return response.json();
}

// Get single business by ID
export async function getBusinessById(id: number): Promise<Business> {
    const response = await fetch(`${API_BASE_URL}/businesses/${id}`);

    if (!response.ok) {
        throw new Error('Business not found');
    }

    return response.json();
}

// Create new business
export async function createBusiness(business: Partial<Business>): Promise<Business> {
    const response = await fetch(`${API_BASE_URL}/businesses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(business),
    });

    if (!response.ok) {
        throw new Error('Failed to create business');
    }

    const result = await response.json();
    return result.business;
}

// Auth types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: 'admin' | 'student';
    student_id?: string;
    university?: string;
}

export interface LoginResponse {
    success: boolean;
    token: string;
    user: User;
}

// Auth functions
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
    }

    return response.json();
}

export async function getProfile(): Promise<User> {
    const token = localStorage.getItem('auth_token');

    if (!token) {
        throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to get profile');
    }

    const data = await response.json();
    return data.user;
}

// Token management
export function saveToken(token: string): void {
    localStorage.setItem('auth_token', token);
}

export function removeToken(): void {
    localStorage.removeItem('auth_token');
}

export function getToken(): string | null {
    return localStorage.getItem('auth_token');
}

export function isAuthenticated(): boolean {
    const token = getToken();
    if (!token) return false;

    try {
        // Simple JWT expiry check
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        return payload.exp > now;
    } catch {
        return false;
    }
}