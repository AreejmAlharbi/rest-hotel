// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// export const authGuard: CanActivateFn = () => {
//   const auth = inject(AuthService);
//   const router = inject(Router);

//   // لو عندك signal isAuthenticated:
//   if (auth.isAuthenticated && auth.isAuthenticated()) return true;

//   // بديلًا: افحص currentUser:
//   if (auth.currentUser && auth.currentUser()) return true;

//   router.navigate(['/auth/login'], { queryParams: { r: '/account/reservations' } });
//   return false;
// };



import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // isAuthenticated عندك Signal؛ استدعِه كـ function
  if (auth.isAuthenticated()) {
    return true;
  }
  // لو ما فيه تسجيل دخول، رجّع UrlTree لصفحة الدخول
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
};
