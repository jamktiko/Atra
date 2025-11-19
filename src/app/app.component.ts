import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { NgToastComponent, NgToastService } from 'ng-angular-popup';

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
  constructor(private toast: NgToastService, private auth: AuthService) {}

  ngOnInit() {
    this.auth.checkAuth().then((isAuth) => {
      if (isAuth) {
        this.toast.success('Logged in successfully!');
      } else {
        this.toast.warning('Please log in.');
      }
    });
  }
}
