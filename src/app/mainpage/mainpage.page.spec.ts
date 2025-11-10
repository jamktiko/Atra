import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MainpagePage } from './mainpage.page';

describe('MainpagePage', () => {
  let component: MainpagePage;
  let fixture: ComponentFixture<MainpagePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainpagePage, HttpClientTestingModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MainpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // tests that the component was created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // test that the header title is rendered correctly
  it('should render the header with title "ATRA"', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('ion-title');
    expect(title?.textContent?.trim()).toBe('ATRA');
  });
});
