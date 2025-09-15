
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {

   constructor(i18n: LanguageService) {
    i18n.init(); // 👈 تحميل اللغة المحفوظة + ضبط dir/lang
}

}