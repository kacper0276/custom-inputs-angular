import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'date-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
})
export class DatePickerComponent {
  @Input() isRangeSelection: boolean = false;
  @Output() dateSelected = new EventEmitter<{
    startDate: Date | null;
    endDate: Date | null;
  }>();

  startDate: Date | null = null;
  endDate: Date | null = null;
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  daysInMonth: Date[] = [];
  isSelectingMonthYear = false;
  years: number[] = [];
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  selectedYear: number | null = null;

  constructor() {
    this.generateCalendar();
    this.generateYears();
  }

  generateCalendar() {
    this.daysInMonth = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);

    for (let i = firstDay.getDay(); i > 0; i--) {
      this.daysInMonth.push(
        new Date(this.currentYear, this.currentMonth, 1 - i)
      );
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      this.daysInMonth.push(new Date(this.currentYear, this.currentMonth, i));
    }
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      this.years.push(i);
    }
  }

  selectDate(date: Date) {
    if (!this.isRangeSelection) {
      this.startDate = date;
      this.endDate = null;
      return;
    }

    if (!this.startDate) {
      this.startDate = date;
    } else if (!this.endDate) {
      if (date >= this.startDate) {
        this.endDate = date;
      } else {
        this.endDate = this.startDate;
        this.startDate = date;
      }
    } else {
      this.startDate = date;
      this.endDate = null;
    }

    this.dateSelected.emit({
      startDate: this.startDate,
      endDate: this.endDate,
    });
  }

  isSelected(date: Date): boolean {
    if (!this.startDate) return false;
    if (!this.endDate) return this.isSameDay(date, this.startDate);
    return date >= this.startDate && date <= this.endDate;
  }

  isInRange(date: Date): boolean | null {
    return (
      this.startDate &&
      this.endDate &&
      date > this.startDate &&
      date < this.endDate
    );
  }

  isSameDay(d1: Date, d2: Date): boolean {
    return d1.toDateString() === d2.toDateString();
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  toggleMonthYearSelection() {
    this.isSelectingMonthYear = !this.isSelectingMonthYear;
  }

  selectYear(year: number) {
    this.selectedYear = year;
  }

  selectMonth(month: number) {
    if (this.selectedYear !== null) {
      this.currentMonth = month;
      this.currentYear = this.selectedYear;
      this.selectedYear = null; // Resetujemy wybrany rok po wybraniu miesiąca
      this.isSelectingMonthYear = false;
      this.generateCalendar();
    }
  }

  get currentMonthName(): string {
    return this.months[this.currentMonth];
  }
}
