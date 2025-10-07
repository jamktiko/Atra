/* import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
import { ComponentFixture } from '@angular/core/testing';

describe('AppComponent', () => {
  //Declare testbed variables
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges(); // triggers rendering
  });

  // Test to check if the app component is created successfully
  it('should create the app', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  //test is to check if the ion-router-outlet is rendered
  it('should render ion-router-outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('ion-router-outlet');
    expect(title).toBeTruthy();
  });
});
 */
