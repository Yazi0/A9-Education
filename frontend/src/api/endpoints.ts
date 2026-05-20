export const API_ENDPOINTS = {
  USERS: {
    ME: 'users/me/',
    UPDATE_PROFILE: 'users/update-profile/',
  },
  PAYMENTS: {
    CREATE_SESSION: 'payments/create-session/',
    WEBHOOK: 'payments/webhook/',
  },
  SUBJECTS: {
    LIST: 'subjects/',
    DETAIL: (id: number | string) => `subjects/${id}/`,
  },
  ENROLLMENTS: {
    MY_SUBJECTS: 'enrollments/my-subjects/',
  },
  ADMIN: {
    STATS: 'admin/stats/',
    USERS: 'admin/users/',
    SUBJECTS: 'admin/subjects/',
    PAYMENTS: 'admin/payments/',
    ENROLLMENTS: 'admin/enrollments/',
  }
};