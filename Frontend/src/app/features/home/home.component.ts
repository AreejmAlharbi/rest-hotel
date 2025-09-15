import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { NgIf, NgFor } from '@angular/common';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router'; 

import { toSignal } from '@angular/core/rxjs-interop';
import { RoomService } from '../../core/services/room.service'; 
import { RoomDto } from '../../core/models/room.model';
import { formatDate } from '@angular/common';
import { signal } from '@angular/core';
import { Room } from '../../core/models/room.model';
import { ContactSectionComponent } from './contact-section.component';
import { ViewportScroller } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule, NgIf, NgFor,
    MatFormFieldModule, MatInputModule,
    MatDatepickerModule, MatNativeDateModule, MatButtonModule,
    MatSelectModule,
    RevealOnScrollDirective,
    RouterLink,
    CurrencyPipe,
    ContactSectionComponent,
    TranslateModule,

    
  ],
  templateUrl: './home.component.html'
})


export class HomeComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
   private roomsApi = inject(RoomService);
  private route = inject(ActivatedRoute);
  private scroller = inject(ViewportScroller);

go(id: number) { this.router.navigate(['/rooms', id]); }
 
 results = signal<RoomDto[] | null>(null);
  searching = signal(false);
  searchError = signal<string | null>(null);


   form = this.fb.group({
  checkIn: this.fb.control<Date | null>(null, { validators: [Validators.required] }),
  checkOut: this.fb.control<Date | null>(null, { validators: [Validators.required] }),
});

private toApiDate(d: Date | null): string {
    if (!d) return '';
    const pad = (n: number) => `${n}`.padStart(2, '0');
    const y = d.getFullYear();
    const m = pad(d.getMonth() + 1);
    const da = pad(d.getDate());
    return `${y}-${m}-${da}`;
  }

 onSearch() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { checkIn, checkOut } = this.form.getRawValue();
    const ci = this.toApiDate(checkIn as Date);
    const co = this.toApiDate(checkOut as Date);

    this.searching.set(true);
    this.searchError.set(null);
    this.results.set([]);

    this.roomsApi.searchAvailable({ checkIn: ci, checkOut: co }).subscribe({
      next: rooms => { this.results.set(rooms); this.searching.set(false); },
      error: () => { this.searchError.set('Failed to load available rooms.'); this.searching.set(false); }
    });
  }



private rooms = inject(RoomService);

  latestRooms$ = this.rooms.getLatest3();
  latestRooms = toSignal<RoomDto[] | null>(this.latestRooms$, { initialValue: null });

  constructor() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => this.scroller.scrollToAnchor(fragment), 0);
      }
    });
  }

}
