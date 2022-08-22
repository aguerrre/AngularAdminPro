import { AfterViewInit, Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';

declare const google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'adminpro';

  constructor(private router: Router, private userService: UserService, private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id: "15307362820-d3aks7td6ljrkdo2l9d5d45je6cl7uao.apps.googleusercontent.com",
      callback: (response: any) => this.handleCredentialResponse(response)
    });
  }

  handleCredentialResponse(response: any) {
    this.userService.loginGoogle(response.credential).subscribe({
      next: (resp: any) => {
        this.ngZone.run(() => {
          this.router.navigateByUrl('/');
        })
      }
    })
  }

}
