import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[revealOnScroll]',
  standalone: true,
})
export class RevealOnScrollDirective implements OnInit {
  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    const node = this.el.nativeElement;
    node.classList.add('reveal'); // حالة البداية
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            node.classList.add('reveal-active');
            io.unobserve(node);
          }
        }
      },
      { threshold: 0.12 }
    );
    io.observe(node);
  }
}
