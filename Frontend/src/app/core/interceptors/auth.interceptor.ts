// import { HttpInterceptorFn } from '@angular/common/http';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const raw = localStorage.getItem('auth');
//   if (raw) {
//     try {
//       const { token } = JSON.parse(raw);
//       if (token) {
//         req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
//       }
//     } catch {}
//   }
//   return next(req);
// };

import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // نخزن المستخدم في localStorage باسم 'auth' (كما في AuthService)
  const raw = localStorage.getItem('auth');
  if (!raw) return next(req);

  try {
    const user = JSON.parse(raw);
    const token: string | undefined = user?.token;

    // أضف التوكن فقط لطلبات الـ API
    if (token && req.url.startsWith('/api/')) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next(authReq);
    }
  } catch {
    // لو فشل الـparse نمرر الطلب كما هو
  }
  return next(req);
};
