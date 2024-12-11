import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  isOpen = input(false);
  title = input('');
  showCancel = input(true);
  cancelText = input('Cancel');
  confirmText = input('Confirm');
  // bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600
  confirmButtonClass = input('px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600');

  onConfirm = output<void>();
  onCancel = output<void>();

  


}
