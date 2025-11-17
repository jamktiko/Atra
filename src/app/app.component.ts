import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { NgToastComponent, NgToastService } from 'ng-angular-popup';
import { isHybrid } from 'src/main';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, NgToastComponent],
})
/**
 * Capacitor gets redirectUrl-info from AuthService: via checkAuth-method
 *
 */
export class AppComponent implements OnInit {
  constructor(private auth: AuthService, private toast: NgToastService) {}

  ngOnInit() {
    console.log('isHybrid returns: ', isHybrid);
    this.auth.checkAuth().then((isAuth) => {
      if (isAuth) {
        console.log('isAuth returns true: ', isAuth);
        this.toast.success('Log in successful!');
      } else if (isAuth === false) {
        console.log('isAuth returns false: ', isAuth);
        this.toast.warning('Please log in or register');
      }
    });
  }
}
