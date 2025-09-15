import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // لو ما فيه مستخدم، رجّع للهوم
  if (!auth.isAuthenticated()) {
    router.navigateByUrl('/');
    return false;
  }

  // فقط إذا الدور Admin من الباكند
  if (auth.isAdmin()) return true;

  router.navigateByUrl('/');
  return false;
};
