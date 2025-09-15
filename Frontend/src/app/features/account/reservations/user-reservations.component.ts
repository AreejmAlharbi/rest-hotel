// import { Component, OnInit, computed, inject, signal } from '@angular/core';
// import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';

// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule }      from '@angular/material/input';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

// import { BookingService } from '../../../core/services/booking.service';
// import { Reservation } from '../../../core/models/reservation.model';
// import { AuthService } from '../../../core/services/auth.service';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// import { TranslateService } from '@ngx-translate/core';



// @Component({
//    selector: 'app-user-reservations',
//   standalone: true,
//   imports: [
//     CommonModule, ReactiveFormsModule, RouterLink,
//     MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
//     CurrencyPipe, DatePipe,
//     MatSnackBarModule  , TranslateModule           
//   ],
//   providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-US' }],
//   templateUrl: './user-reservations.component.html'

// })
// export class UserReservationsComponent implements OnInit {
//   private auth = inject(AuthService);
//   private router = inject(Router);
//   private fb = inject(FormBuilder);
//   private bookings = inject(BookingService);

//   user = computed(() => this.auth.currentUser());
//   loading = signal(true);
//   error = signal<string | null>(null);
//   items = signal<Reservation[]>([]);
//   editingId = signal<number | null>(null);

//   private snack = inject(MatSnackBar);


//   form = this.fb.group({
//   GuestName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),

//   // خليه تاريخ (Date | null) لأن الـ Datepicker يشتغل على Date
//   CheckInDate: this.fb.control<Date | null>(null, Validators.required),
//   CheckOutDate: this.fb.control<Date | null>(null, Validators.required),
// });


//   ngOnInit() {
//     if (!this.user()) { this.router.navigateByUrl('/auth/login'); return; }
//     this.load();
//   }

//  private toYmdLocal(d: any): string {
//   if (!d) return '';
//   const date = d instanceof Date ? d : new Date(d);
//   const y = date.getFullYear();
//   const m = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${y}-${m}-${day}`;
// }

// private parseYmdLocal(s: string | null | undefined): Date | null {
//   if (!s) return null;
//   // ندعم "YYYY-MM-DD" أو "YYYY-MM-DDTHH:mm:ss"
//   const p = s.split('T')[0].split('-').map((x) => parseInt(x, 10));
//   if (p.length < 3 || Number.isNaN(p[0])) return null;
//   return new Date(p[0], p[1] - 1, p[2]);
// }



//   load() {
//   this.loading.set(true);
//   this.error.set(null);

//   this.bookings.getMine().subscribe({
//     next: (rs) => {
//       // اعرض الحجوزات غير الملغاة فقط
//       const active = (rs || []).filter(x => !x.IsCanceled);
//       this.items.set(active);
//       this.loading.set(false);
//     },
//     error: () => {
//       this.error.set('Failed to load reservations.');
//       this.loading.set(false);
//     }
//   });
// }


// startEdit(r: any) {
//   this.editingId.set(r.Id);
//   this.form.setValue({
//     GuestName: r.GuestName,
//     CheckInDate: this.parseYmdLocal(r.CheckInDate),
//     CheckOutDate: this.parseYmdLocal(r.CheckOutDate),
//   });
// }


// cancelEdit() {
//   this.editingId.set(null);
// }

// save() {
//   const id = this.editingId();
//   if (!id || this.form.invalid) { this.form.markAllAsTouched(); return; }

//   const v = this.form.getRawValue();
//   const payload = {
//     GuestName: v.GuestName,
//     CheckInDate: this.toYmdLocal(v.CheckInDate as any),
//     CheckOutDate: this.toYmdLocal(v.CheckOutDate as any),
//   };

//   this.bookings.update(id, payload).subscribe({
//     next: (updated) => {
//       this.items.update(list => list.map(x => x.Id === id ? updated : x));
//       this.editingId.set(null);

//       this.snack.open('Reservation updated successfully ✅', 'OK', {
//       duration: 2500,
//       verticalPosition: 'top',       
//       horizontalPosition: 'center'   
//     });
//   },
//     error: () => this.error.set('Failed to update reservation.')
//   });
// }


// cancelReservation(r: Reservation) {
//   if (!confirm('Cancel this reservation?')) return;

//   const id = r.Id;

//   this.bookings.cancel(id).subscribe({
//     next: () => {
//       // احذف الحجز من القائمة بدل ما يبقى كرت فاضي
//       this.items.update(list => list.filter(x => x.Id !== id));

//       // لو كنتِ بالمود تعديل هذا الحجز، أغلقيه
//       if (this.editingId() === id) this.editingId.set(null);

//       // إشعار نجاح أعلى الصفحة
//       this.snack.open('Reservation canceled', 'OK', {
//         duration: 2500,
//         verticalPosition: 'top',
//         horizontalPosition: 'center',
//       });
//     },
//     error: () => {
//       this.error.set('Failed to cancel reservation.');
//       // إشعار فشل أعلى الصفحة
//       this.snack.open('Failed to cancel reservation', 'Dismiss', {
//         duration: 3000,
//         verticalPosition: 'top',
//         horizontalPosition: 'center',
//       });
//     }
//   });
// }


// }

import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

import { BookingService } from '../../../core/services/booking.service';
import { Reservation } from '../../../core/models/reservation.model';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-reservations',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
    CurrencyPipe, DatePipe,
    MatSnackBarModule, TranslateModule
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-US' }],
  templateUrl: './user-reservations.component.html'
})
export class UserReservationsComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private bookings = inject(BookingService);

  user = computed(() => this.auth.currentUser());
  loading = signal(true);
  error = signal<string | null>(null);
  items = signal<Reservation[]>([]);
  editingId = signal<number | null>(null);

  private snack = inject(MatSnackBar);
  private t = inject(TranslateService); // ✅ للترجمة في Snackbar

  form = this.fb.group({
    GuestName: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(2)]),
    CheckInDate: this.fb.control<Date | null>(null, Validators.required),
    CheckOutDate: this.fb.control<Date | null>(null, Validators.required),
  });

  ngOnInit() {
    if (!this.user()) { this.router.navigateByUrl('/auth/login'); return; }
    this.load();
  }

  private toYmdLocal(d: any): string {
    if (!d) return '';
    const date = d instanceof Date ? d : new Date(d);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private parseYmdLocal(s: string | null | undefined): Date | null {
    if (!s) return null;
    const p = s.split('T')[0].split('-').map((x) => parseInt(x, 10));
    if (p.length < 3 || Number.isNaN(p[0])) return null;
    return new Date(p[0], p[1] - 1, p[2]);
  }

  load() {
    this.loading.set(true);
    this.error.set(null);

    this.bookings.getMine().subscribe({
      next: (rs) => {
        const active = (rs || []).filter(x => !x.IsCanceled);
        this.items.set(active);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load reservations.');
        this.loading.set(false);
      }
    });
  }

  startEdit(r: any) {
    this.editingId.set(r.Id);
    this.form.setValue({
      GuestName: r.GuestName,
      CheckInDate: this.parseYmdLocal(r.CheckInDate),
      CheckOutDate: this.parseYmdLocal(r.CheckOutDate),
    });
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  save() {
    const id = this.editingId();
    if (!id || this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.getRawValue();
    const payload = {
      GuestName: v.GuestName,
      CheckInDate: this.toYmdLocal(v.CheckInDate as any),
      CheckOutDate: this.toYmdLocal(v.CheckOutDate as any),
    };

    this.bookings.update(id, payload).subscribe({
      next: (updated) => {
        this.items.update(list => list.map(x => x.Id === id ? updated : x));
        this.editingId.set(null);

        // ✅ نصوص مترجمة
        this.snack.open(
          this.t.instant('toasts.reservations.updated'),
          this.t.instant('common.ok'),
          {
            duration: 2500,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          }
        );
      },
      error: () => this.error.set('Failed to update reservation.')
    });
  }

  cancelReservation(r: Reservation) {
    // if (!confirm('Cancel this reservation?')) return;

    const msg = this.t.instant('dialogs.confirmCancel');
if (!confirm(msg)) return;

    const id = r.Id;

    this.bookings.cancel(id).subscribe({
      next: () => {
        this.items.update(list => list.filter(x => x.Id !== id));
        if (this.editingId() === id) this.editingId.set(null);

        // ✅ نصوص مترجمة
        this.snack.open(
          this.t.instant('toasts.reservations.canceled'),
          this.t.instant('common.ok'),
          {
            duration: 2500,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          }
        );
      },
      error: () => {
        this.error.set('Failed to cancel reservation.');
        // ✅ نصوص مترجمة
        this.snack.open(
          this.t.instant('toasts.reservations.cancelFailed'),
          this.t.instant('common.dismiss'),
          {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          }
        );
      }
    });
  }
}

