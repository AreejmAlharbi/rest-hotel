import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, ExtraOptions } from '@angular/router';
import { routes } from './app.routes';

const routerOptions: ExtraOptions = {
  anchorScrolling: 'enabled',
  scrollOffset: [0, 80], // إذا كان لديك نافبار ثابت
};


@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
    }),
    // بقية الاستيرادات...
  ],
  // ...
})
export class AppModule {}
