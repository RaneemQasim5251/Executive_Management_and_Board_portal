import type { AuthBindings } from "@refinedev/core";

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    // Board & C-Suite authentication
    const executiveCredentials = [
      { email: "board@company.com", password: "executive2024", role: "Board Chairman" },
      { email: "ceo@company.com", password: "ceo2024", role: "Chief Executive Officer" },
      { email: "cfo@company.com", password: "cfo2024", role: "Chief Financial Officer" },
      { email: "cto@company.com", password: "cto2024", role: "Chief Technology Officer" },
    ];

    const user = executiveCredentials.find(
      (cred) => cred.email === email && cred.password === password
    );

    if (user) {
      localStorage.setItem("auth", JSON.stringify(user));
      return {
        success: true,
        redirectTo: "/",
      };
    }

    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid credentials. Board of Directors & C-Suite access only.",
      },
    };
  },

  logout: async () => {
    localStorage.removeItem("auth");
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

  getPermissions: async () => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return parsedUser.role;
    }
    return null;
  },

  getIdentity: async () => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const parsedUser = JSON.parse(auth);
      return {
        id: parsedUser.email,
        name: parsedUser.role,
        email: parsedUser.email,
        avatar: "🏢", // Executive icon
      };
    }
    return null;
  },

  onError: async (error) => {
    console.error(error);
    return { error };
  },
};