export const API = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    WHOAMI: "/auth/whoami",
    UPDATE_PROFILE: "/auth/update",
    RESET_PASSWORD: "/auth/reset-password",
    GOOGLE_AUTH: "/auth/google",
    FORGOT_PASSWORD: "/auth/forgot-password",
  },
  INVESTOR: {
    // future
  },
  ENTREPRENEUR: {
    // future
  },
  ADMIN: {
    USERS: "/admin/users",
    USER_BY_ID: (id: string) => `/admin/users/${id}`,
  },
};
