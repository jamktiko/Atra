import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { InksPage } from './inks.page';
import { By } from '@angular/platform-browser';

describe('InksPage', () => {
  let component: InksPage;
  let fixture: ComponentFixture<InksPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InksPage, HttpClientTestingModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(InksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //test if the search bar is rendered correctly
  it('should render a search bar', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const searchbar = compiled.querySelector('ion-searchbar');
    expect(searchbar).toBeTruthy();
  });

  //TODO: test if after triggering filteredSearch-function
});
