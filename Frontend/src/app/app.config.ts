

// import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
// import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
// import { routes } from './app.routes';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import { provideHttpClient, withInterceptors /*, withFetch*/ } from '@angular/common/http';
// import { authInterceptor } from './core/interceptors/auth.interceptor';




// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideBrowserGlobalErrorListeners(),
//     provideZonelessChangeDetection(),

//     // ✅ سجل الراوتر مرّة واحدة واجمع الميزات
//     provideRouter(
//       routes,
//       withComponentInputBinding(),
//       withInMemoryScrolling({
//         anchorScrolling: 'enabled',
//         scrollPositionRestoration: 'enabled',
//       })
//     ),

//     provideAnimationsAsync(),

//     // ✅ سجل HttpClient مرّة واحدة ومعه الـ interceptor
//     provideHttpClient(
//       withInterceptors([authInterceptor])
//       // ,withFetch() // لو احتجته اختياريًا
//     ),
//   ]
// };


// src/app/app.config.ts

//2nd try

// import {
//   ApplicationConfig,
//   importProvidersFrom,
//   provideBrowserGlobalErrorListeners,
//   provideZonelessChangeDetection,
// } from '@angular/core';
// import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
// import { routes } from './app.routes';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { authInterceptor } from './core/interceptors/auth.interceptor';

// import { HttpClient } from '@angular/common/http';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { JsonHttpLoader } from './i18n/json-http-loader';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideBrowserGlobalErrorListeners(),
//     provideZonelessChangeDetection(),

//     provideRouter(
//       routes,
//       withComponentInputBinding(),
//       withInMemoryScrolling({
//         anchorScrolling: 'enabled',
//         scrollPositionRestoration: 'enabled',
//       })
//     ),

//     provideAnimationsAsync(),
//     provideHttpClient(withInterceptors([authInterceptor])),

//     importProvidersFrom(
//       TranslateModule.forRoot({
//         defaultLanguage: 'en',
//         loader: { provide: TranslateLoader, useClass: JsonHttpLoader, deps: [HttpClient] }
//       })
//     ),
//   ],
// };


// src/app/app.config.ts
// import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
// import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
// import { routes } from './app.routes';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { authInterceptor } from './core/interceptors/auth.interceptor';

// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { JsonHttpLoader } from './i18n/json-http-loader'; // 👈 انتبه للمسار الصحيح حسب بنية مشروعك
// // إذا كان هذا السطر خاطئ المسار عندك، استخدم: './i18n/json-http-loader'

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideBrowserGlobalErrorListeners(),
//     provideZonelessChangeDetection(),
//     provideRouter(
//       routes,
//       withComponentInputBinding(),
//       withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })
//     ),
//     provideAnimationsAsync(),
//     provideHttpClient(withInterceptors([authInterceptor])),

//     // 👇 تفعيل ngx-translate مع اللودر المخصّص (بدون factory ولا وسائط)
//     importProvidersFrom(
//       TranslateModule.forRoot({
//         defaultLanguage: 'en',
//         loader: { provide: TranslateLoader, useClass: JsonHttpLoader },
//       })
//     ),
//   ],
// };

// app.config.ts
// import { ApplicationConfig, provideBrowserGlobalErrorListeners /*, provideZonelessChangeDetection*/ } from '@angular/core';
// import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
// import { routes } from './app.routes';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { authInterceptor } from './core/interceptors/auth.interceptor';

// // i18n
// import { importProvidersFrom } from '@angular/core';
// import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// import { HttpClient } from '@angular/common/http';
// import { JsonTranslateLoader } from './i18n/json-translate-loader';

// // Factory بسيط لإنشاء اللودر
// export function jsonLoaderFactory(http: HttpClient): TranslateLoader {
//   return new JsonTranslateLoader(http); // يقرأ من assets/i18n/<lang>.json
// }

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideBrowserGlobalErrorListeners(),

//     // ✅ الراوتر (مرّة واحدة مع الميزات)
//     provideRouter(
//       routes,
//       withComponentInputBinding(),
//       withInMemoryScrolling({
//         anchorScrolling: 'enabled',
//         scrollPositionRestoration: 'enabled',
//       })
//     ),

//     provideAnimationsAsync(),

//     // ✅ HttpClient مع الإنترسبتور
//     provideHttpClient(withInterceptors([authInterceptor])),

//     // ✅ تفعيل ngx-translate باستخدام اللودر الخاص بنا
//     importProvidersFrom(
//       TranslateModule.forRoot({
//         defaultLanguage: 'en',
//         loader: {
//           provide: TranslateLoader,
//           useFactory: jsonLoaderFactory,
//           deps: [HttpClient]
//         }
//       })
//     ),
//   ]
// };

// src/app/app.config.ts
// import { ApplicationConfig, importProvidersFrom } from '@angular/core';
// import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
// import { routes } from './app.routes';
// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { authInterceptor } from './core/interceptors/auth.interceptor';

// // 👇 الترجمة
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// // لودر مخصّص بسيط: يرجع JSON من مجلد الـ assets
// export function httpLoaderFactory(http: HttpClient): TranslateLoader {
//   return {
//     getTranslation(lang: string): Observable<any> {
//       return http.get(`/assets/i18n/${lang}.json`);
//     }
//   } as TranslateLoader;
// }

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(
//       routes,
//       withComponentInputBinding(),
//       withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })
//     ),
//     provideHttpClient(withInterceptors([authInterceptor])),

//     // 👇 نسجّل TranslateModule على مستوى التطبيق مع اللودر المخصّص
//     importProvidersFrom(
//       TranslateModule.forRoot({
//         defaultLanguage: 'en',
//         loader: { provide: TranslateLoader, useFactory: httpLoaderFactory, deps: [HttpClient] }
//       })
//     ),
//   ],
// };


// src/app/app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export function httpLoaderFactory(http: HttpClient): TranslateLoader {
  // لا نستخدم TranslateHttpLoader إطلاقًا
  return {
    getTranslation(lang: string): Observable<any> {
      // مسار نسبي: assets/i18n/<lang>.json
      return http.get(`assets/i18n/${lang}.json`);

    }
  } as TranslateLoader;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })
    ),
    provideHttpClient(withInterceptors([authInterceptor])),

    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: { provide: TranslateLoader, useFactory: httpLoaderFactory, deps: [HttpClient] }
      })
    ),
  ],
};
