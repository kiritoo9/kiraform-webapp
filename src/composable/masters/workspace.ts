import { apiCall } from "../common/api";
import pinia from '@/pinia';
import { setActivePinia } from 'pinia';

setActivePinia(pinia);

import { useAuthStore } from '@/stores/access_token';
const authStore = useAuthStore();
authStore.loadToken();

export async function getWorkspace() {
    try {
        const response: any = await apiCall('/workspaces', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authStore.accessToken}`
            }
        });
        return response;
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error?.message : 'Terjadi kesalahan saat mengambil data workspace';
        throw new Error(errorMessage);
    }
};

export async function addWorkspace(data: any) {
    try {
        const response: any = await apiCall('/workspaces', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authStore.accessToken}`
            }
        });
        return response;
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error?.message : 'Terjadi kesalahan saat menambahkan data workspace';
        throw new Error(errorMessage);
    }
};

export async function editWorkspace(id: string, data: any) {
    try {
        const response: any = await apiCall(`/workspaces/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authStore.accessToken}`
            }
        });
        return response;
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error?.message : 'Terjadi kesalahan saat menambahkan data workspace';
        throw new Error(errorMessage);
    }
};

export async function deleteWorkspace(id: string) {
    try {
        const response: any = await apiCall(`/workspaces/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authStore.accessToken}`
            }
        });
        return response;
    } catch (error: any) {
        const errorMessage = error instanceof Error ? error?.message : 'Terjadi kesalahan saat menghapus data workspace';
        throw new Error(errorMessage);
    }
};