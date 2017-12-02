import { Component, ElementRef, HostListener, Input, AfterViewInit, Renderer } from '@angular/core';
import { throttle } from 'lodash';

@Component({
  selector: 'xello-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css']
})
export class ToolTipComponent implements AfterViewInit {
  private tipTarget;
  private throttled = false;
  private readonly escapeKeyCode = 27;
  private readonly screenEdge = 20;
  private readonly delay = 400;
  private throttleScroll = throttle( () => this.ChangeTipPosition(), this.delay);

  visible = false;

  tipCssClasses = {
    tip: true,
    top: true,
    bottom: false
  };

  tipArrowClass = {
    arrow: true,
    'arrow-top': true,
    'arrow-bottom': false
  };

  constructor(private el: ElementRef, private renderer: Renderer) {
    this.tipTarget = this.el.nativeElement.parentNode;
  }

  ngAfterViewInit() {
    this.renderer.setElementStyle(this.tipTarget, 'position', 'relative');
  }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // Keep the tooltip open if user clicked inside the tooltip or clicked on the toltip's target
    const clicked = (event.target === this.tipTarget) ||
                    (this.el.nativeElement.contains(event.target));
    this.visible = clicked;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event) {
    // Escape key will close the tooltip
    if (event.keyCode === this.escapeKeyCode) {
      this.visible = false;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    // Throttle the ChangeTipPosition function on scroll.
    this.throttleScroll();
  }

  private ChangeTipPosition() {
    const tipPos = this.tipTarget.getBoundingClientRect();
    if (tipPos.top <= this.screenEdge) {
      this.tipCssClasses.top = false;
      this.tipCssClasses.bottom = true;
      this.tipArrowClass['arrow-top'] = false;
      this.tipArrowClass['arrow-bottom'] = true;
    } else {
      this.tipCssClasses.top = true;
      this.tipCssClasses.bottom = false;
      this.tipArrowClass['arrow-top'] = true;
      this.tipArrowClass['arrow-bottom'] = false;
    }
  }

}
