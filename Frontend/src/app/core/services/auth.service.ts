import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export type UserRole = 'Admin' | 'User';

export interface LoginDto { email: string; password: string; }
export interface RegisterDto { fullName: string; email: string; password: string; }

export interface AuthResponse {
  token?: string;  // JSON الشائع من .NET (camelCase)
  Token?: string;  // في حال الباك يرسل PascalCase
  user?: { id: number | string; fullName: string; email: string; role?: UserRole };
  User?: { Id: number | string; FullName: string; Email: string; Role?: UserRole };
}

export interface AuthUser {
  id?: number | string;
  fullName: string;
  email: string;
  role: UserRole;   // من الباكند فقط (JWT أو body)
  token?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private readonly BASE = '/api/users'; // حسب ما ذكرتِ

  currentUser = signal<AuthUser | null>(null);
  isAuthenticated = computed(() => !!this.currentUser()?.token);
  isAdmin = computed(() => this.currentUser()?.role === 'Admin');

  constructor() {
    const raw = localStorage.getItem('auth');
    if (raw) {
      try { this.currentUser.set(JSON.parse(raw)); } catch { localStorage.removeItem('auth'); }
    }
  }

  // ==== API ====
  login(data: LoginDto) {
    const payload = { Email: data.email, Password: data.password }; // يتطابق مع LoginRequestDto
    return this.http.post<AuthResponse>(`${this.BASE}/login`, payload)
      .pipe(tap(res => this.setSessionFromResponse(res)));
  }

  register(data: RegisterDto) {
    const payload = { FullName: data.fullName, Email: data.email, Password: data.password }; // RegistrationRequestDto
    return this.http.post<AuthResponse>(`${this.BASE}/register`, payload)
      .pipe(tap(res => this.setSessionFromResponse(res)));
  }

  logout() {
    localStorage.removeItem('auth');
    this.currentUser.set(null);
  }

  // ==== Helpers ====
  private setSessionFromResponse(res: AuthResponse) {
    // يدعم camelCase و PascalCase
    const token = res?.token ?? res?.Token;
 

    // حاول قراءة claims من الـJWT (لو الباك يضعها)
    const claims = token ? this.decodeJwt(token) : {};

// خذي الـId/Email من الـclaims بصيغ ASP.NET القياسية:
let id = this.getClaim(claims, [
  'sub',
  'nameid',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
]);

let email = this.getClaim(claims, [
  'email',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
]);

// لو ما عندك name في الـJWT، بنعتمد على body.user.FullName (اللي ترجعه الـAPI)
let fullName =
  this.getClaim(claims, ['name', 'unique_name']) || '';

// Role من الـclaims (أو من body.user.role إن رجعته الـAPI)
let role = this.readRoleFromClaims(claims) as UserRole | undefined;

// دمج بيانات body.user (يدعم PascalCase و camelCase)
const bodyUser =
  res?.user ??
  (res?.User
    ? { id: res.User.Id, fullName: res.User.FullName, email: res.User.Email, role: res.User.Role as UserRole }
    : undefined);

if (bodyUser) {
  id = bodyUser.id ?? id;
  fullName = bodyUser.fullName ?? fullName;
  email = bodyUser.email ?? email;
  role = (bodyUser.role as UserRole) ?? role;
}

const user: AuthUser = {
  id,
  fullName,
  email,
  role: role === 'Admin' ? 'Admin' : 'User',
  token
};

localStorage.setItem('auth', JSON.stringify(user));
this.currentUser.set(user);

  }

  private decodeJwt(token: string): any {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json);
  } catch { return {}; }
}

private readRoleFromClaims(claims: any): string | undefined {
  // Role في ASP.NET
  const v =
    claims?.role ??
    claims?.roles ??
    claims?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  return Array.isArray(v) ? v[0] : v;
}

private getClaim(claims: any, keys: string[]): any {
  for (const k of keys) {
    if (claims && claims[k] != null) return claims[k];
  }
  return undefined;
}

// === Helpers for other services (e.g., reservations) ===

// أرجِع التوكن من الذاكرة إن وُجد، وإلا من localStorage('auth')
getToken(): string | null {
  const t = this.currentUser()?.token;
  if (t) return t;
  try {
    const raw = localStorage.getItem('auth');
    return raw ? (JSON.parse(raw)?.token ?? null) : null;
  } catch {
    return null;
  }
}

// فكّ تشفير الـ JWT وأرجِع الـ claims
getDecoded(): any | null {
  const token = this.getToken();
  if (!token) return null;
  return this.decodeJwt(token); // تستعمل decodeJwt الموجودة عندك
}

// أرجِع الـ userId (رقم) من:
// 1) currentUser().id لو كان رقم
// 2) أو من الـ claims: nameid / uri / sub
getUserId(): number | null {
  const idFromState = this.currentUser()?.id;
  const n1 = Number(idFromState);
  if (Number.isFinite(n1)) return n1;

  const claims = this.getDecoded();
  if (!claims) return null;

  const raw = this.getClaim(claims, [
    'nameid',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
    'sub'
  ]);

  const n2 = Number(raw);
  return Number.isFinite(n2) ? n2 : null;
}


}
