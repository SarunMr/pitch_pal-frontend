export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  ONBOARDING: "/onboarding",
  UNAUTHORIZED: "/unauthorized",
  DASHBOARD: {
    INVESTOR: "/investor",
    ENTREPRENEUR: "/entrepreneur",
    ADMIN: "/admin",
  },
  PROFILE: "/profile",
  ADMIN_USERS: "/admin/users",
  ADMIN_USERS_CREATE: "/admin/users/create",
  ADMIN_USERS_EDIT: (id: string) => `/admin/users/${id}/edit`,
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const;

export type AppRoutes = typeof ROUTES;
