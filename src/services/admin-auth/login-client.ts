/**
 * Client-side login service
 * Calls /api/admin/login and handles response
 */

export interface LoginResponse {
  success: boolean;
  message?: string;
}

export interface LoginError {
  status: number;
  message: string;
}

export async function loginAdmin(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: include cookies in request
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      return { success: true };
    }

    // Handle error responses
    if (response.status === 401) {
      throw { status: 401, message: 'Email o contraseña inválidos' } as LoginError;
    }

    if (response.status === 403) {
      throw { status: 403, message: 'Acceso denegado' } as LoginError;
    }

    throw { status: response.status, message: 'Error en el servidor' } as LoginError;
  } catch (error) {
    // Re-throw if already a LoginError
    if (error && typeof error === 'object' && 'status' in error) {
      throw error;
    }
    // Otherwise wrap network errors
    throw { status: 0, message: 'Error de conexión' } as LoginError;
  }
}
