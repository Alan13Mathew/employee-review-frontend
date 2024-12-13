import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {

  loginForm: FormGroup;
  loginType: 'employee' | 'admin' = 'employee';
  errorMessage = '';

  activeClass = 'flex-1 text-center py-2 rounded-lg bg-blue-500 text-white transition-all';
  inactiveClass = 'flex-1 text-center py-2 rounded-lg hover:bg-gray-300 transition-all';

  authService = inject(AuthService);

  constructor(private fb: FormBuilder,private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,Validators.minLength(6)]]
    });
  }


  setLoginType(type: 'employee' | 'admin') {
    this.loginType = type;
    this.loginForm.reset();
  }

  onSubmit() {
    console.log(this.loginForm.value);

    // const email = this.loginForm.value.email;
    // const password = this.loginForm.value.password;
    const { email, password } = this.loginForm.value
    // TODO: Add login logic
    if (this.loginType === 'employee') {
      this.handelEmployeeLogin(email, password);
    } else {
      this.handleAdminLogin(email, password);
    }
  }



  private handleAdminLogin(email: string, password: string) {
    // Demo admin credentials
    if (email === 'admin@gmail.com' && password === 'admin@123') {
      localStorage.setItem('userRole', 'admin');
      this.router.navigate(['admin-dashboard/employees']);
    } else {
      this.errorMessage = 'Invalid admin credentials';
    }
  }

  private handelEmployeeLogin(email: string, password: string) {
    // TODO: Add employee login logic
    console.log('employee login');

    this.authService.login(email, password).subscribe(result => {
      if(result === 'success'){
        localStorage.setItem('userRole', 'employee');
        this.router.navigate(['employee-dashboard']);
      }
      else{
        // TODO: Add error handling logic
        console.log('invalid password');
        this.errorMessage = result;
        if (result === 'invalid password') {
          this.loginForm.get('password')?.setErrors({ incorrect: true });
        } else {
          this.loginForm.get('email')?.setErrors({ incorrect: true });
        }
      }
    });
  }
  

}
