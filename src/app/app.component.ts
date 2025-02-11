import { Component, OnInit } from '@angular/core';
import { InputComponent } from './components/input/input.component';
import { MockDataService } from './services/mock-data.service';
import { HourPickerComponent } from './components/hour-picker/hour-picker.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InputComponent, HourPickerComponent, DatePickerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'test';
  inputValue: string = '';
  placeholder: string = '';
  colorValue: string = '#4fc3f7';

  constructor(private dataService: MockDataService) {}

  ngOnInit(): void {
    this.dataService.getData().subscribe((data) => {
      this.inputValue = data.inputValue;
      this.placeholder = data.placeholder;
    });
  }

  onInputValueChange(newValue: string) {
    this.inputValue = newValue;
  }

  onColorChange(newValue: string) {
    this.colorValue = newValue;
  }
}
