export const API = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    WHOAMI: "/auth/whoami",
    UPDATE_PROFILE: "/auth/update",
    RESET_PASSWORD: "/auth/reset-password",
    GOOGLE_AUTH: "/auth/google",
    FORGOT_PASSWORD: "/auth/forgot-password",
    KYC_SUBMIT: "/auth/kyc",
    KYC_STATUS: "/auth/kyc/status",
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
    KYC_LIST: "/admin/users/kyc/list",
    KYC_VERIFY: (userId: string) => `/admin/users/kyc/${userId}/verify`,
    KYC_REJECT: (userId: string) => `/admin/users/kyc/${userId}/reject`,
  },
};
