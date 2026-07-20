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
    PITCHES: "/v1/pitches/admin/queue",
    PITCH_STATUS: (id: string) => `/v1/pitches/admin/${id}/review`,
    PITCH_EDIT_REQUEST: (id: string) => `/v1/pitches/admin/${id}/edit-request`,
  },
  PITCH: {
    PUBLIC: "/v1/pitches",
    MY: "/v1/pitches/my/pitches",
    CREATE: "/v1/pitches",
    BY_ID: (id: string) => `/v1/pitches/${id}`,
    UPDATE: (id: string) => `/v1/pitches/${id}`,
    DELETE: (id: string) => `/v1/pitches/${id}`,
    SUBMIT: (id: string) => `/v1/pitches/${id}/submit`,
    TIERS: (id: string) => `/v1/pitches/${id}/tiers`,
    MILESTONES: (id: string) => `/v1/pitches/${id}/milestones`,
    VIDEO: (id: string) => `/v1/pitches/${id}/video`,
    REQUEST_EDIT: (id: string) => `/v1/pitches/${id}/request-edit`,
  },
};
