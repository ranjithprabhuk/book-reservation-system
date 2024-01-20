import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const AuthGuard = () => {
  const router = inject(Router);
  const loginUrl = '/auth/login';

  const storedUserInfo = window.localStorage.getItem('user');
  if (storedUserInfo) {
    try {
      const user = JSON.parse(storedUserInfo);
      if (user?.id) {
        return true;
      }
    } catch (e) {
      return router.parseUrl(loginUrl);
    }
  }

  return router.parseUrl(loginUrl);
};
