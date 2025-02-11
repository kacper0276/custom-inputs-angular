import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'hour-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hour-picker.component.html',
  styleUrl: './hour-picker.component.scss',
})
export class HourPickerComponent implements AfterViewInit {
  @Output() timeRangeSelected = new EventEmitter<{
    start: string;
    end: string;
  }>();

  @ViewChild('hourScroll') hourScroll!: ElementRef;
  @ViewChild('minuteScroll') minuteScroll!: ElementRef;

  selectedMode: 'start' | 'end' = 'start';
  startTime: string = '00:00';
  endTime: string = '00:00';

  selectedHour: number = 0;
  selectedMinute: number = 0;

  hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  minutes: number[] = Array.from({ length: 60 }, (_, i) => i);

  isDraggingHour = false;
  isDraggingMinute = false;
  startY = 0;
  scrollStart = 0;
  activeScroll!: ElementRef;

  ngAfterViewInit() {
    setTimeout(() => this.updateScrollPosition(), 100);
  }

  setMode(mode: 'start' | 'end') {
    this.selectedMode = mode;
    const [hour, minute] = (mode === 'start' ? this.startTime : this.endTime)
      .split(':')
      .map(Number);
    this.selectedHour = hour;
    this.selectedMinute = minute;
    this.updateScrollPosition();
  }

  selectHour(hour: number) {
    this.selectedHour = hour;
    this.updateTime();
    this.scrollToElement(this.hourScroll, hour);
  }

  selectMinute(minute: number) {
    this.selectedMinute = minute;
    this.updateTime();
    this.scrollToElement(this.minuteScroll, minute);
  }

  updateTime() {
    const timeString = `${this.selectedHour
      .toString()
      .padStart(2, '0')}:${this.selectedMinute.toString().padStart(2, '0')}`;
    if (this.selectedMode === 'start') {
      this.startTime = timeString;
    } else {
      this.endTime = timeString;
    }
    this.timeRangeSelected.emit({ start: this.startTime, end: this.endTime });
  }

  updateScrollPosition() {
    setTimeout(() => {
      this.scrollToElement(this.hourScroll, this.selectedHour);
      this.scrollToElement(this.minuteScroll, this.selectedMinute);
    }, 50);
  }

  scrollToElement(container: ElementRef, index: number) {
    if (!container?.nativeElement) return;

    const elements = container.nativeElement.children;
    if (
      !elements ||
      elements.length === 0 ||
      index < 0 ||
      index >= elements.length
    )
      return;

    const elementTop = elements[index].offsetTop;
    container.nativeElement.scrollTop =
      elementTop - container.nativeElement.offsetTop;
  }

  startDrag(event: MouseEvent | TouchEvent, type: 'hour' | 'minute') {
    if (type === 'hour') {
      this.isDraggingHour = true;
      this.activeScroll = this.hourScroll;
    } else {
      this.isDraggingMinute = true;
      this.activeScroll = this.minuteScroll;
    }
    this.startY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    this.scrollStart = this.activeScroll.nativeElement.scrollTop;
  }

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  stopDrag() {
    if (this.isDraggingHour) this.handleLoopScroll(this.hourScroll, 24);
    if (this.isDraggingMinute) this.handleLoopScroll(this.minuteScroll, 60);
    this.isDraggingHour = false;
    this.isDraggingMinute = false;
  }

  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:touchmove', ['$event'])
  onDrag(event: MouseEvent | TouchEvent) {
    if (!this.isDraggingHour && !this.isDraggingMinute) return;
    event.preventDefault();
    const currentY =
      'touches' in event ? event.touches[0].clientY : event.clientY;
    const deltaY = this.startY - currentY;
    this.activeScroll.nativeElement.scrollTop = this.scrollStart + deltaY;
  }

  handleLoopScroll(container: ElementRef, max: number) {
    const elements = container.nativeElement.children;
    const middleIndex = Math.floor(elements.length / 2);
    const scrollTop = container.nativeElement.scrollTop;
    let closestIndex = 0;
    let minDiff = Infinity;

    for (let i = 0; i < elements.length; i++) {
      const diff = Math.abs(elements[i].offsetTop - scrollTop);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }

    const value = parseInt(elements[closestIndex].textContent, 10);

    if (value === 0 && closestIndex > middleIndex) {
      this.scrollToElement(container, max - 1);
    } else if (value === max - 1 && closestIndex < middleIndex) {
      this.scrollToElement(container, 0);
    }

    if (max === 24) this.selectedHour = value;
    else this.selectedMinute = value;
    this.updateTime();
  }
}
