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

  it('should filter inks by product_name', () => {
    //mock userInks; follows Interface
    component.userInks = [
      {
        user_ink_id: 1,
        batch_number: 'B001',
        opened_at: new Date('2025-01-01'),
        expires_at: new Date('2026-01-01'),
        favorite: false,
        publicink_ink_id: 101,
        product_name: 'Pilot Blue Ink',
        manufacturer: 'Pilot',
        color: 'Blue',
        recalled: false,
        image_url: 'https://example.com/image1.jpg',
        size: '50ml',
        User_user_id: 'test',
      },
      {
        user_ink_id: 2,
        batch_number: 'B002',
        opened_at: new Date('2025-02-01'),
        expires_at: new Date('2026-02-01'),
        favorite: true,
        publicink_ink_id: 102,
        product_name: 'Diamine Oxblood',
        manufacturer: 'Diamine',
        color: 'Red',
        recalled: false,
        image_url: 'https://example.com/image2.jpg',
        size: '30ml',
        User_user_id: 'test',
      },
      {
        user_ink_id: 3,
        batch_number: 'B003',
        opened_at: new Date('2025-03-01'),
        expires_at: new Date('2026-03-01'),
        favorite: false,
        publicink_ink_id: 103,
        product_name: 'Lamy Blue',
        manufacturer: 'Lamy',
        color: 'Blue',
        recalled: false,
        image_url: 'https://example.com/image3.jpg',
        size: '50ml',
        User_user_id: 'test',
      },
    ];

    //search by color
    component.searchItem = 'blue';
    let result = component.filteredSearch();
    expect(result.length).toBe(2);
    expect(result.some((ink) => ink.product_name === 'Lamy Blue')).toBeTrue();
    expect(
      result.some((ink) => ink.product_name === 'Pilot Blue Ink')
    ).toBeTrue();

    //search by name
    component.searchItem = 'oxblood';
    result = component.filteredSearch();
    expect(result.length).toBe(1);
    expect(result[0].product_name).toBe('Diamine Oxblood');

    //empty search
    component.searchItem = '';
    result = component.filteredSearch();
    expect(result.length).toBe(3);

    //search to find nothing
    component.searchItem = 'green';
    result = component.filteredSearch();
    expect(result.length).toBe(0);
  });
});
