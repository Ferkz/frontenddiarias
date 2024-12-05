import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShowMessageComponent } from '../components/show-message/show-message.component';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private durationInSeconds = 5;

  constructor(private _snackBar: MatSnackBar) {}

  showMessage(message: string, type: 'success' | 'error'): void {
    this._snackBar.openFromComponent(ShowMessageComponent, {
      data: { message, type },
      duration: this.durationInSeconds * 1000,
    });
  }
}
