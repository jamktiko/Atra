import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoutPage } from './logout.page';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/services/auth.service';
import { CustomSecureStorage } from 'src/app/services/customsecurestorage';

describe('LogoutPage', () => {
  let component: LogoutPage;
  let fixture: ComponentFixture<LogoutPage>;

  const mockAuthService = {
    logout: jasmine.createSpy('logout').and.returnValue(Promise.resolve()),
  };

  const mockStorage = {
    clear: jasmine.createSpy('clear'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoutPage, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CustomSecureStorage, useValue: mockStorage },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.logout when logout() is triggered', async () => {
    await component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
