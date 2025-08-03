import type { AuthBindings } from "@refinedev/core";
import { supabase } from "../supabase";

export const supabaseAuthProvider: AuthBindings = {
  login: async ({ email, password }) => {
    try {
      // Demo credentials check first
      const isDemoCredentials = email === "board@company.com" && password === "executive2024";
      
      if (isDemoCredentials) {
        // Demo login success
        const demoUser = {
          id: "demo-exec-user-001",
          email: "board@company.com",
          user_metadata: {
            name: "Executive Demo User",
            role: "Board Member",
            avatar_url: ""
          }
        };
        
        localStorage.setItem("auth", JSON.stringify(demoUser));
        return {
          success: true,
          redirectTo: "/",
        };
      }

      // Check if we're in demo mode first
        const isDemoMode = !(import.meta as any).env?.VITE_SUPABASE_URL ||
                    (import.meta as any).env?.VITE_SUPABASE_URL === "https://demo.supabase.co" ||
                    (import.meta as any).env?.VITE_SUPABASE_ANON_KEY === "demo-anon-key";

      if (isDemoMode) {
        // In demo mode, only allow demo credentials
        return {
          success: false,
          error: {
            name: "LoginError",
            message: "Demo mode: Please use demo credentials → board@company.com / executive2024",
          },
        };
      }

      try {
        // Try real Supabase authentication only if not in demo mode
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return {
            success: false,
            error: {
              name: "LoginError",
              message: error.message || "Invalid credentials. Board of Directors & C-Suite access only.",
            },
          };
        }

        if (data?.user) {
          // Store user info
          localStorage.setItem("auth", JSON.stringify(data.user));
          return {
            success: true,
            redirectTo: "/",
          };
        }
      } catch (networkError) {
        // Handle network errors gracefully
        return {
          success: false,
          error: {
            name: "LoginError",
            message: "Connection failed. Please check your internet connection or try demo credentials.",
          },
        };
      }

      return {
        success: false,
        error: {
          name: "LoginError",
          message: "Invalid credentials. Board of Directors & C-Suite access only.",
        },
      };
    } catch (error: any) {
      // Final catch for any unexpected errors
      return {
        success: false,
        error: {
          name: "LoginError", 
          message: "Connection error. Please try demo credentials: board@company.com / executive2024",
        },
      };
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return {
          success: false,
          error: {
            name: "LogoutError",
            message: error.message,
          },
        };
      }

      localStorage.removeItem("auth");
      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "LogoutError",
          message: error.message || "Logout failed",
        },
      };
    }
  },

  check: async () => {
    try {
      // Check for demo user first
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        const userData = JSON.parse(storedAuth);
        if (userData.id === "demo-exec-user-001") {
          return {
            authenticated: true,
          };
        }
      }

      // Check real Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        redirectTo: "/login",
      };
    } catch (error: any) {
      // Check for stored demo auth on error
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        try {
          const userData = JSON.parse(storedAuth);
          if (userData.id === "demo-exec-user-001") {
            return {
              authenticated: true,
            };
          }
        } catch {
          // Invalid stored data, proceed to login
        }
      }
      
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },

  getPermissions: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Get user role from user metadata or database
        const role = user.user_metadata?.role || 'executive';
        return {
          permissions: [role],
        };
      }

      return {
        permissions: [],
      };
    } catch (error) {
      return {
        permissions: [],
      };
    }
  },

  getIdentity: async () => {
    try {
      // Check for demo user first
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        const userData = JSON.parse(storedAuth);
        if (userData.id === "demo-exec-user-001") {
          return {
            id: userData.id,
            name: userData.user_metadata?.name || 'Executive Demo User',
            email: userData.email || 'board@company.com',
            avatar: userData.user_metadata?.avatar_url || '',
            role: userData.user_metadata?.role || 'Board Member',
          };
        }
      }

      // Get real Supabase user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        return {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Executive User',
          email: user.email || '',
          avatar: user.user_metadata?.avatar_url || '',
          role: user.user_metadata?.role || 'Board Member',
        };
      }

      return null;
    } catch (error) {
      // Fallback to demo user if stored
      const storedAuth = localStorage.getItem("auth");
      if (storedAuth) {
        try {
          const userData = JSON.parse(storedAuth);
          if (userData.id === "demo-exec-user-001") {
            return {
              id: userData.id,
              name: userData.user_metadata?.name || 'Executive Demo User',
              email: userData.email || 'board@company.com',
              avatar: userData.user_metadata?.avatar_url || '',
              role: userData.user_metadata?.role || 'Board Member',
            };
          }
        } catch {
          // Invalid stored data
        }
      }
      return null;
    }
  },

  onError: async (error) => {
    console.error("Auth Error:", error);
    
    if (error.status === 401) {
      return {
        logout: true,
        redirectTo: "/login",
      };
    }

    return {};
  },

  // Register method for creating new users (admin only)
  register: async ({ email, password, name, role = 'executive' }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: {
            name: "RegisterError",
            message: error.message,
          },
        };
      }

      if (data?.user) {
        return {
          success: true,
          redirectTo: "/login",
        };
      }

      return {
        success: false,
        error: {
          name: "RegisterError",
          message: "Registration failed",
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "RegisterError",
          message: error.message || "Registration failed",
        },
      };
    }
  },

  // Forgot password
  forgotPassword: async ({ email }) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return {
          success: false,
          error: {
            name: "ForgotPasswordError",
            message: error.message,
          },
        };
      }

      return {
        success: true,
        message: "Password reset email sent",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "ForgotPasswordError",
          message: error.message || "Failed to send reset email",
        },
      };
    }
  },
};