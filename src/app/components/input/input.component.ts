import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxColorsModule } from 'ngx-colors';

export type InputType = 'text' | 'password' | 'email' | 'number' | 'color';

export type ValidationRule =
  | 'minLength'
  | 'upperCase'
  | 'lowerCase'
  | 'specialChar'
  | 'number'
  | 'emailFormat'
  | 'phoneNumber'
  | 'all';

@Component({
  selector: 'custom-input',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule,
    TranslateModule,
    NgxColorsModule,
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputComponent implements OnInit, OnChanges {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() validationRules: ValidationRule[] = [];
  @Input() inputType: InputType = 'text';
  @Input() inputValue: string = '';
  @Input() validationIsEnabled: boolean = true;
  @Input() disabled: boolean = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() validationStatus = new EventEmitter<string>();

  initialInputType: InputType = 'password';
  validationMessage: string = '';

  constructor(private readonly translateService: TranslateService) {}

  ngOnInit() {
    this.initialInputType = this.inputType;
  }

  ngOnChanges() {
    this.validationMessage = this.getValidationMessage();
  }

  toggleInputType() {
    this.inputType = this.inputType === 'text' ? 'password' : 'password';
  }

  private getValidationMessage(): string {
    if (
      !this.inputValue ||
      this.inputValue.length === 0 ||
      !this.validationIsEnabled
    ) {
      return '';
    }

    if (this.validationRules.length > 0) {
      return this.getCustomValidationMessage();
    }

    return this.getDefaultValidationMessage();
  }

  private getCustomValidationMessage(): string {
    const allRules = [
      'minLength',
      'upperCase',
      'lowerCase',
      'number',
      'specialChar',
      'emailFormat',
      'phoneNumber',
    ];

    const activeRules = this.validationRules.includes('all')
      ? allRules
      : this.validationRules;

    if (activeRules.includes('minLength') && this.inputValue.length < 9) {
      return `${this.translateService.instant(
        'minimal-required-length-form-validation'
      )} 8`;
    }
    if (activeRules.includes('upperCase') && !/[A-Z]/.test(this.inputValue)) {
      return this.translateService.instant('uppercase-letter-form-validation');
    }
    if (activeRules.includes('lowerCase') && !/[a-z]/.test(this.inputValue)) {
      return this.translateService.instant('lowercase-letter-form-validation');
    }
    if (activeRules.includes('number') && !/\d/.test(this.inputValue)) {
      return this.translateService.instant('number-form-validation');
    }
    if (
      activeRules.includes('specialChar') &&
      !/[!@#$%^&*(),.?":{}|<>]/.test(this.inputValue)
    ) {
      return this.translateService.instant('special-character-form-validation');
    }

    if (this.inputType === 'email' || activeRules.includes('emailFormat')) {
      return this.validateEmail();
    }

    if (this.inputType === 'text' && activeRules.includes('phoneNumber')) {
      return this.validatePhoneNumber();
    }

    return '';
  }

  private getDefaultValidationMessage(): string {
    switch (this.inputType) {
      case 'email':
        return this.validateEmail();

      case 'password':
      case 'text':
        if (this.validationRules.includes('all')) {
          return this.validatePassword();
        }
        return this.validatePassword();

      default:
        return '';
    }
  }

  private validateEmail(): string {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.inputValue)) {
      return this.translateService.instant('please-enter-a-valid-email');
    }
    return '';
  }

  private validatePhoneNumber(): string {
    const phoneRegex = /^\d{9}$/;
    if (!phoneRegex.test(this.inputValue)) {
      return this.translateService.instant('please-enter-a-valid-phone-number');
    }
    return '';
  }

  private validatePassword(): string {
    if (this.inputValue.length < 9) {
      return `${this.translateService.instant(
        'minimal-required-length-form-validation'
      )} 8`;
    }
    if (!/[A-Z]/.test(this.inputValue)) {
      return this.translateService.instant('uppercase-letter-form-validation');
    }
    if (!/[a-z]/.test(this.inputValue)) {
      return this.translateService.instant('lowercase-letter-form-validation');
    }
    if (!/\d/.test(this.inputValue)) {
      return this.translateService.instant('number-form-validation');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(this.inputValue)) {
      return this.translateService.instant('special-character-form-validation');
    }
    return '';
  }

  onInputChange() {
    this.valueChange.emit(this.inputValue);
    this.validationStatus.emit(this.getValidationMessage());
  }

  onColorChange(event: any) {
    this.inputValue = event;
    this.valueChange.emit(this.inputValue);
  }
}
