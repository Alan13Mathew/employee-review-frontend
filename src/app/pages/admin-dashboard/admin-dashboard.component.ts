import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DialogComponent } from '../../components/dialog/dialog.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink,RouterOutlet,DialogComponent],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent {

  private router = inject(Router);
  private authService = inject(AuthService);
  showLogoutDialog = false;



confirmLogout(){
  this.authService.logout();
  this.router.navigate(['/login']);
  this.showLogoutDialog = false;
}

handleLogout() {
  this.showLogoutDialog = true;
}


}
