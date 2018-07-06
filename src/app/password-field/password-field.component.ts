import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { from } from 'rxjs/observable/from';
import { mergeMap } from 'rxjs/operators';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-password-field',
  templateUrl: './password-field.component.html',
  styleUrls: ['./password-field.component.scss']
})
export class PasswordFieldComponent implements OnInit, OnDestroy {
  displayBox = false;
  hasCapsLockOn = false;

  events_: Subscription;
  input_: Subscription;

  @ViewChild('password') passwordField: ElementRef;

  form: FormGroup;

  constructor() {}

  @HostListener('window:keydown', ['$event'])
  onKeyDown(e) {
    this.setCapsLockStatus(e);
  }
  @HostListener('window:keyup', ['$event'])
  onKeyUp(e) {
    this.setCapsLockStatus(e);
  }

  setCapsLockStatus(e) {
    this.hasCapsLockOn = e.getModifierState && e.getModifierState('CapsLock');
  }

  ngOnInit() {
    this.form = new FormGroup({
      password: new FormControl('')
    });
    this.events_ = from(['focus', 'blur'])
      .pipe(
        mergeMap((event: any) =>
          fromEvent(this.passwordField.nativeElement, event)
        )
      )
      .subscribe(({ type }) => {
        switch (type) {
          case 'focus':
            this.onFocus();
            break;
          case 'blur':
            this.onBlur();
        }
      });
    this.input_ = this.form
      .get('password')
      .valueChanges.subscribe(data => this.validate(data));
  }

  onFocus() {
    this.displayBox = true;
  }

  onBlur() {
    if (this.form.get('password').value.trim().length === 0) {
      this.displayBox = false;
    }
  }

  validate(data) {
    console.log(data);
  }

  ngOnDestroy() {
    this.events_.unsubscribe();
    this.input_.unsubscribe();
  }
}
