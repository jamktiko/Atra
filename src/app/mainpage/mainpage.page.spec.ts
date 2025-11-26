import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainpagePage } from './mainpage.page';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../services/auth.service';

describe('MainpagePage', () => {
  let component: MainpagePage;
  let fixture: ComponentFixture<MainpagePage>;

  const mockAuthService = {
    getUser: jasmine
      .createSpy('getUser')
      .and.returnValue({ name: 'Test User' }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainpagePage, RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(MainpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header with title "ATRA"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('ion-title');
    expect(title?.textContent?.trim()).toBe('ATRA');
  });
});
