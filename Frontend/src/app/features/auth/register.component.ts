import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';


function match(controlName: string, confirmName: string) {
  return (group: AbstractControl): ValidationErrors | null => {
    const c = group.get(controlName)?.value;
    const d = group.get(confirmName)?.value;
    return c === d ? null : { notMatch: true };
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  template: `
<section class="min-h-screen bg-slate-900 text-slate-100 grid place-items-center px-6 py-12">
  <div class="w-full max-w-xl">
    <div class="mb-8 text-center">
      <h1 class="text-4xl font-extrabold tracking-tight">{{ 'register.title' | translate }}</h1>
      <p class="text-slate-300 mt-2">{{ 'register.subtitle' | translate }}</p>
    </div>

    <div class="rounded-2xl bg-[#F3ECE1] text-slate-800 ring-1 ring-[#E6D9C9] shadow-xl p-6 md:p-8">
      <form [formGroup]="form" (ngSubmit)="submit()" class="grid gap-4">
        <div>
          <label class="block text-sm font-semibold mb-2">{{ 'register.fullName' | translate }}</label>
          <input formControlName="fullName" type="text"
                 [placeholder]="'register.fullNamePh' | translate"
                 class="w-full h-[48px] rounded-xl border border-[#E6D9C9] bg-white px-3 outline-none focus:ring-2 focus:ring-slate-400">
          <div class="mt-1 text-xs text-rose-600" *ngIf="submitted && form.controls.fullName.invalid">
            {{ 'register.fullNameErr' | translate }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2">{{ 'register.email' | translate }}</label>
          <input formControlName="email" type="email"
                 [placeholder]="'register.emailPh' | translate"
                 class="w-full h-[48px] rounded-xl border border-[#E6D9C9] bg-white px-3 outline-none focus:ring-2 focus:ring-slate-400">
          <div class="mt-1 text-xs text-rose-600" *ngIf="submitted && form.controls.email.invalid">
            {{ 'register.emailErr' | translate }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2">{{ 'register.password' | translate }}</label>
          <div class="relative">
            <input [type]="showPwd() ? 'text' : 'password'" formControlName="password"
                   [placeholder]="'register.passwordPh' | translate"
                   class="w-full h-[48px] rounded-xl border border-[#E6D9C9] bg-white px-3 pr-12 outline-none focus:ring-2 focus:ring-slate-400">
            <button type="button"
                    class="absolute inset-y-0 right-2 my-auto rounded-lg px-2 text-slate-500 hover:text-slate-700"
                    (click)="showPwd.set(!showPwd())">
              <span class="material-icons-outlined">{{ showPwd() ? 'visibility_off' : 'visibility' }}</span>
            </button>
          </div>
          <div class="mt-1 text-xs text-rose-600" *ngIf="submitted && form.controls.password.invalid">
            {{ 'register.passwordErr' | translate }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2">{{ 'register.confirm' | translate }}</label>
          <input [type]="showPwd() ? 'text' : 'password'" formControlName="confirmPassword"
                 [placeholder]="'register.confirmPh' | translate"
                 class="w-full h-[48px] rounded-xl border border-[#E6D9C9] bg-white px-3 outline-none focus:ring-2 focus:ring-slate-400">
          <div class="mt-1 text-xs text-rose-600" *ngIf="submitted && notMatch">
            {{ 'register.mismatch' | translate }}
          </div>
        </div>

        <button class="mt-2 h-[48px] rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold disabled:opacity-60"
                [disabled]="loading() || form.invalid">
          {{ (loading() ? 'register.creating' : 'register.signUp') | translate }}
        </button>

        <div *ngIf="error()" class="text-sm text-rose-600">
          {{ error() }}
        </div>
      </form>

      <div class="mt-4 text-sm text-slate-600">
        {{ 'register.hasAccount' | translate }}
        <a routerLink="/auth/login" class="text-slate-900 font-semibold hover:underline">
          {{ 'register.signIn' | translate }}
        </a>
      </div>
    </div>
  </div>
</section>

  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);
  submitted = false;
  showPwd = signal(false);

 form = this.fb.nonNullable.group({
  fullName: ['', [Validators.required, Validators.minLength(2)]],
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]],
  confirmPassword: ['', [Validators.required]]
}, { validators: match('password', 'confirmPassword') });

get notMatch() {
  return this.form.errors?.['notMatch'];
}

  submit() {
  this.submitted = true;
  if (this.form.invalid) return;

  this.loading.set(true);
  this.error.set(null);

  const { fullName, email, password } = this.form.getRawValue(); // من nonNullable: كلها string

  this.auth.register({ fullName, email, password }).subscribe({
    next: () => {
      this.loading.set(false);
      this.router.navigateByUrl('/');
    },
   error: (err) => {
  this.loading.set(false);
  const msg =
    err?.error?.message ||
    err?.error?.title ||       // بعض .NET APIs ترجع title
    err?.statusText ||
    'Login failed.';
  this.error.set(msg);
}

  });
}

}
