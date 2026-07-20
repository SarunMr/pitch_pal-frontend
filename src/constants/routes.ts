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
  // Admin
  ADMIN_USERS: "/admin/users",
  ADMIN_USERS_CREATE: "/admin/users/create",
  ADMIN_USERS_EDIT: (id: string) => `/admin/users/${id}/edit`,
  ADMIN_KYC: "/admin/kyc",
  ADMIN_PITCHES: "/admin/pitches",
  ADMIN_PITCH_REVIEW: (id: string) => `/admin/pitches/${id}`,
  // Entrepreneur
  ENTREPRENEUR_PITCHES: "/entrepreneur/pitches",
  ENTREPRENEUR_PITCH_CREATE: "/entrepreneur/pitches/create",
  ENTREPRENEUR_PITCH_EDIT: (id: string) => `/entrepreneur/pitches/create?edit=${id}`,
  ENTREPRENEUR_PITCH_DETAIL: (id: string) => `/entrepreneur/pitches/${id}`,
  // Investor
  INVESTOR_PITCHES: "/investor/pitches",
  INVESTOR_PITCH_DETAIL: (id: string) => `/investor/pitches/${id}`,
  // Auth
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  KYC: "/kyc",
} as const;

export type AppRoutes = typeof ROUTES;
