import { create } from 'zustand';

export const useUserStore = create((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  userId: '',
  setUserId: (userId) => set({ userId }),

  userName: '',
  setUserName: (userName) => set({ userName }),

  userEmail: '',
  setUserEmail: (userEmail) => set({ userEmail }),

  userPhone: '',
  setUserPhone: (userPhone) => set({ userPhone }),

  userRole: 'user',
  setUserRole: (userRole) => set({ userRole }),

  clearUserStore: () =>
    set({
      userId: '',
      userName: '',
      userEmail: '',
      userPhone: '',
      userRole: '',
      isAuthenticated: false,
    }),
}));
