
// import { Component, inject, OnInit, signal } from '@angular/core';
// import { ActivatedRoute, RouterLink } from '@angular/router';
// import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
// import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

// import { RoomService } from '../../core/services/room.service';
// import { RoomDto } from '../../core/models/room.model';
// import { BookingService } from '../../core/services/booking.service';
// import { AuthService } from '../../core/services/auth.service'; // ✅ جديد

// import { NgClass } from '@angular/common';
// import { MatDialog } from '@angular/material/dialog';
// import { MatDialogModule } from '@angular/material/dialog';

// // Angular Material
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule }      from '@angular/material/input';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
// import { MatIconModule }       from '@angular/material/icon';
// import { MatButtonModule }     from '@angular/material/button';

// @Component({
//   selector: 'app-room-details',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterLink,
//     ReactiveFormsModule,
//     CurrencyPipe,
//     NgClass,
//     MatFormFieldModule,
//     MatInputModule,
//     MatDatepickerModule,
//     MatNativeDateModule,
//     MatIconModule,
//     MatButtonModule,
//     MatDialogModule,
//   ],
//   providers: [
//     { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
//   ],
//   templateUrl: './room-details.component.html',
//   styleUrls: ['./room-details.component.css']
// })
// export class RoomDetailsComponent implements OnInit {
//   private fb = inject(FormBuilder);
//   private route = inject(ActivatedRoute);
//   private roomsApi = inject(RoomService);
//   private dialog = inject(MatDialog);
//   private reservationApi = inject(BookingService);
//   private auth = inject(AuthService); // ✅ جديد

//   room = signal<RoomDto | null>(null);
//   loading = signal(true);

//   // نُبقي حقل guestName موجودًا لأن القالب قد يعتمد عليه،
//   // لكن سنملؤه تلقائيًا من المستخدم الحالي
//   form = this.fb.group({
//     guestName: ['', [Validators.required, Validators.minLength(2)]],
//     checkInDate: [null, Validators.required],
//     checkOutDate: [null, Validators.required],
//   });

//   ngOnInit() {
//     // جلب بيانات الغرفة
//     const id = Number(this.route.snapshot.paramMap.get('id'));
//     this.roomsApi.getById(id).subscribe({
//       next: r => { this.room.set(r); this.loading.set(false); },
//       error: () => this.loading.set(false),
//     });

//     // تعبئة اسم/إيميل المستخدم تلقائيًا في الحقل (للعرض فقط)
//     const u = this.auth.currentUser();
//     const displayName = (u?.fullName || u?.email || '').trim();
//     if (displayName) {
//       this.form.patchValue({ guestName: displayName });
//     }
//   }

//   // تحويل التاريخ لصيغة yyyy-MM-dd
//   private toYmd(d: any): string {
//     if (!d) return '';
//     if (typeof d === 'string') return d;
//     try { return (d as Date).toISOString().slice(0, 10); } catch { return ''; }
//   }

//   book() {
//     // تحقّق من تحميل الغرفة
//     const room = this.room();
//     if (!room) {
//       alert('Room data not loaded. Please try again later.');
//       return;
//     }

//     // تحقّق من تسجيل الدخول
//     const user = this.auth.currentUser();
//     const guestName = (user?.fullName || user?.email || '').trim();
//     if (!guestName) {
//       alert('Please sign in to book this room.');
//       return;
//     }

//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }

//     // تواريخ من الـ Datepicker
//     const ci = this.form.value.checkInDate;
//     const co = this.form.value.checkOutDate;

//     const reservation = {
//       guestName,                        // ✅ نستخدم اسم/إيميل المستخدم الحالي دائماً
//       roomId: room.id,
//       checkInDate: this.toYmd(ci),
//       checkOutDate: this.toYmd(co)
//     };

//     this.reservationApi.create(reservation).subscribe({
//       next: () => {
//         this.dialog.open(SuccessDialog, {
//           data: { ...reservation, price: room.price },
//           width: '400px',
//           panelClass: 'reservation-success-dialog'
//         });
//         this.form.reset({
//           guestName // نعيد تعبئة الاسم بعد reset
//         });
//       },
//       error: () => {
//         alert('Reservation failed. Please try again.');
//       }
//     });
//   }
// }

// // SuccessDialog component for the message
// import { Inject } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

// @Component({
//   selector: 'success-dialog',
//   standalone: true,
//   imports: [CommonModule, DatePipe, MatButtonModule, MatIconModule],
//   template: `
//     <div style="text-align:center; padding:24px;">
//       <span class="material-icons-outlined" style="font-size:48px; color:#4ade80;">check_circle</span>
//       <h2 style="margin-top:16px; font-weight:bold; color:#222;">Reservation Successful!</h2>
//       <div style="margin:18px 0; color:#444; font-size:17px;">
//         <div><strong>Room Number:</strong> {{data.roomId}}</div>
//         <div><strong>Guest Name:</strong> {{data.guestName}}</div>
//         <div><strong>Check-in:</strong> {{data.checkInDate | date:'mediumDate'}}</div>
//         <div><strong>Check-out:</strong> {{data.checkOutDate | date:'mediumDate'}}</div>
//         <div><strong>Total Price:</strong> {{data.price}} SR</div>
//       </div>
//       <button mat-raised-button color="primary" (click)="closeDialog()">OK</button>
//     </div>
//   `
// })
// export class SuccessDialog {
//   constructor(
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private dialogRef: MatDialogRef<SuccessDialog>
//   ) {}

//   closeDialog() {
//     this.dialogRef.close();
//   }
// }


import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { RoomService } from '../../core/services/room.service';
import { RoomDto } from '../../core/models/room.model';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service'; // ✅

import { NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule }       from '@angular/material/icon';
import { MatButtonModule }     from '@angular/material/button';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';


@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    CurrencyPipe,
    NgClass,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    TranslateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
  ],
  templateUrl: './room-details.component.html',
  styleUrls: ['./room-details.component.css']
})
export class RoomDetailsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private roomsApi = inject(RoomService);
  private dialog = inject(MatDialog);
  private reservationApi = inject(BookingService);
  private auth = inject(AuthService);

  room = signal<RoomDto | null>(null);
  loading = signal(true);

  // نُبقي أسماء حقول النموذج كما هي للاستخدام داخل القالب
  form = this.fb.group({
    guestName: ['', [Validators.required, Validators.minLength(2)]],
    checkInDate: [null, Validators.required],
    checkOutDate: [null, Validators.required],
  });

  ngOnInit() {
    // جلب بيانات الغرفة
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.roomsApi.getById(id).subscribe({
      next: r => { this.room.set(r); this.loading.set(false); },
      error: () => this.loading.set(false),
    });

    // تعبئة اسم/إيميل المستخدم تلقائيًا في الحقل (للعرض فقط)
    const u = this.auth.currentUser();
    const displayName = (u?.fullName || u?.email || '').trim();
    if (displayName) {
      this.form.patchValue({ guestName: displayName });
    }
  }

  // تحويل التاريخ لصيغة yyyy-MM-dd
  private toYmd(d: any): string {
    if (!d) return '';
    if (typeof d === 'string') return d;
    try { return (d as Date).toISOString().slice(0, 10); } catch { return ''; }
  }

  book() {
    // تحقّق من تحميل الغرفة
    const room = this.room();
    if (!room) {
      alert('Room data not loaded. Please try again later.');
      return;
    }

    // تحقّق من تسجيل الدخول
    const user = this.auth.currentUser();
    const guestName = (user?.fullName || user?.email || '').trim();
    if (!guestName) {
      alert('Please sign in to book this room.');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // تواريخ من الـ Datepicker
    const ci = this.form.value.checkInDate;
    const co = this.form.value.checkOutDate;

    // ✅ حمولة PascalCase تطابق DTO في الـ API
    const payload = {
      GuestName: guestName,
      RoomId: room.id,
      CheckInDate: this.toYmd(ci),
      CheckOutDate: this.toYmd(co),
    };

    this.reservationApi.create(payload).subscribe({
      next: () => {
        this.dialog.open(SuccessDialog, {
          data: { ...payload, price: room.price }, // price للاستخدام داخل الرسالة فقط
          width: '400px',
          panelClass: 'reservation-success-dialog'
        });
        this.form.reset({
          guestName // نعيد تعبئة الاسم بعد reset
        });
      },
      error: () => {
        alert('Reservation failed. Please try again.');
      }
    });
  }
}

// SuccessDialog component for the message
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'success-dialog',
  standalone: true,
  imports: [CommonModule, DatePipe, MatButtonModule, MatIconModule],
  template: `
    <div style="text-align:center; padding:24px;">
      <span class="material-icons-outlined" style="font-size:48px; color:#4ade80;">check_circle</span>
      <h2 style="margin-top:16px; font-weight:bold; color:#222;">Reservation Successful!</h2>
      <div style="margin:18px 0; color:#444; font-size:17px;">
        <div><strong>Room Number:</strong> {{data.RoomId}}</div>
        <div><strong>Guest Name:</strong> {{data.GuestName}}</div>
        <div><strong>Check-in:</strong> {{data.CheckInDate | date:'mediumDate'}}</div>
        <div><strong>Check-out:</strong> {{data.CheckOutDate | date:'mediumDate'}}</div>
        <div><strong>Total Price:</strong> {{data.price}} SR</div>
      </div>
      <button mat-raised-button color="primary" (click)="closeDialog()">OK</button>
    </div>
  `
})
export class SuccessDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SuccessDialog>
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
