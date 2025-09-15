import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';

// مزوّدات للاختبار بدلًا من الشبكة الفعلية
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // لأن HomeComponent standalone نضيفه في imports
      imports: [HomeComponent],
      providers: [
        provideHttpClientTesting(), // HttpClient وهمي للاختبار
        provideRouter([]),          // راوتر بسيط للاختبار
        provideAnimations(),        // لأننا نستخدم Angular Material
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
