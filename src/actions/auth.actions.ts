"use server"

import { RegistroFormValues } from '@/domain/schemas/auth.schema';
import { cookies } from 'next/headers';

const API_URL = 'http://localhost:3001/api';

export async function setAuthCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
        path: '/',
        maxAge: 86400,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax',
    });
}

export async function registerUser(data: RegistroFormValues) {
    try {
        // Strip confirmPassword before sending to API
        const payload = {
            ...data,
            role: 'VIAJERO',
        };
        // @ts-expect-error confirmPassword doesn't belong in API payload
        delete payload.confirmPassword;

        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Error al registrar usuario: ${response.statusText}`);
        }

        const newUser = await response.json();
        return newUser;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

export async function loginUser(data: { email: string; password: string; role: string }) {
    try {
        const response = await fetch(`${API_URL}/users?email_eq=${data.email}&password_eq=${data.password}&role_eq=${data.role}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });


        if (!response.ok) {
            throw new Error('Error al conectar con la base de datos de usuarios');
        }

        const users = await response.json();

        if (users.length === 0) {
            throw new Error('Credenciales inválidas');
        }

        const user = users[0];

        // Return a mock token and the user
        return {
            token: `mock-token-${user.id}`,
            user,
        };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function getUserById(userId: string) {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`User fetching error: ${response.statusText}`);
        }

        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null; // Return null instead of crashing for soft mapping
    }
}
