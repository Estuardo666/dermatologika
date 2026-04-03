/**
 * Client-side logout service
 * Calls /api/admin/logout to clear session
 */

export interface LogoutResponse {
  success: boolean;
}

export async function logoutAdmin(): Promise<LogoutResponse> {
  try {
    const response = await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include', // Important: include cookies
    });

    if (response.ok) {
      return { success: true };
    }

    // Even if logout fails, consider it success for UX
    return { success: true };
  } catch {
    // Network error during logout, still consider it success
    return { success: true };
  }
}
