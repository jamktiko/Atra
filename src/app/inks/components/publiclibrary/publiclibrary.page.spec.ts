import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { PubliclibraryPage } from './publiclibrary.page';

describe('PubliclibraryPage', () => {
  let component: PubliclibraryPage;
  let fixture: ComponentFixture<PubliclibraryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PubliclibraryPage, HttpClientTestingModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PubliclibraryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
