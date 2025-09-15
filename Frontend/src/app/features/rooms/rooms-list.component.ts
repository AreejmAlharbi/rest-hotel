// src/app/features/rooms/rooms-list.component.ts
import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule, CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { RoomService } from '../../core/services/room.service';
import { RoomDto } from '../../core/models/room.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';



@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CurrencyPipe, NgOptimizedImage, TranslateModule],
  templateUrl: './rooms-list.component.html'
})
export class RoomsListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private roomsApi = inject(RoomService);

  loading = signal(true);
  rooms   = signal<RoomDto[]>([]);
  // فورم التصفية
  form = this.fb.group({
    q: [''],
    capacity: ['any'],        // any | رقم
    
    sort: ['latest']       
  });

  // نحول valueChanges إلى Signal حتى re-compute يشتغل مع التغييرات
formState = toSignal(this.form.valueChanges, {
  initialValue: this.form.getRawValue()
});

filtered = computed<RoomDto[]>(() => {
  // الآن أي تغيير في الفورم سيعيد حساب filtered
  const { q, capacity, sort } = this.formState();

  let arr = [...this.rooms()];

  // بحث بالنص
  const term = (q ?? '').toString().trim().toLowerCase();
  if (term) {
    arr = arr.filter(r =>
      (r.roomNumber ?? '').toLowerCase().includes(term) ||
      (r.description ?? '').toLowerCase().includes(term)
    );
  }

  // السعة
  if (capacity && capacity !== 'any') {
    const minCap = Number(capacity);
    if (!Number.isNaN(minCap)) {
      arr = arr.filter(r => (r.capacity ?? 0) >= minCap);
    }
  }

  // الترتيب
  switch (sort) {
    case 'priceAsc':  arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0)); break;
    case 'priceDesc': arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0)); break;
    case 'capacity': arr.sort((a, b) => (b.capacity ?? 0) - (a.capacity ?? 0)); break;
    case 'latest':
    default:          arr.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }

  return arr;
});


  ngOnInit(): void {
    this.roomsApi.getAll().subscribe({
      next: (rs) => { this.rooms.set(rs); this.loading.set(false); },
      error: ()    => { this.rooms.set([]); this.loading.set(false); }
    });
  }

 resetFilters(): void {
  this.form.reset({ q: '', capacity: 'any', sort: 'latest' });
}

}

