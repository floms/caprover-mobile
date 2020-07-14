import { Component, OnInit, Input, ElementRef, OnChanges, SimpleChanges, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-console-view',
  templateUrl: './console-view.component.html',
  styleUrls: ['./console-view.component.scss'],
})
export class ConsoleViewComponent implements OnInit, OnChanges {
  @Input() logs = 'loading...';

  @ViewChild('console', { static: true }) consoleElement: ElementRef;

  scrollTop = 0;

  constructor(private hostElement: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    const element = this.hostElement.nativeElement;

    // scroll after elements are rendered
    setTimeout(() => {
      element.scrollTop = this.consoleElement.nativeElement.getBoundingClientRect().height;
    }, 100);
  }

  ngOnInit() { }

  @HostListener('scroll', ['$event'])
  onFocus(event) {
    // TODO: cancel scrolling to bottom if the user manually scrolls
  }
}
