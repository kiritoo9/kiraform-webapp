import { apiCall } from "../common/api";

export async function loginService(email: string, password: string) {
    try {
        const response: any = await apiCall('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        return response;
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error?.message : 'Terjadi kesalahan saat login';
        throw new Error(errorMessage);
    }
};

export async function registService(name: string, email: string, password: string) {
    try {
        const response: any = await apiCall('/register', {
            method: 'POST',
            body: JSON.stringify({ fullname: name, email, password }),
        });
        return response;
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error?.message : 'Terjadi kesalahan saat mendaftar';
        throw new Error(errorMessage);
    }
};