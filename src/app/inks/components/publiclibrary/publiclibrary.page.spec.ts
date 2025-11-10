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

  it('should filter public inks by product_name, manufacturer or color', () => {
    component.allInks = [
      {
        ink_id: 1,
        product_name: 'Pilot Blue',
        manufacturer: 'Pilot',
        color: 'Blue',
        recalled: false,
        image_url: 'https://example.com/pilot.jpg',
        size: '50ml',
      },
      {
        ink_id: 2,
        product_name: 'Diamine Oxblood',
        manufacturer: 'Diamine',
        color: 'Red',
        recalled: false,
        image_url: 'https://example.com/diamine.jpg',
        size: '30ml',
      },
      {
        ink_id: 3,
        product_name: 'Lamy Turquoise',
        manufacturer: 'Lamy',
        color: 'Turquoise',
        recalled: false,
        image_url: 'https://example.com/lamy.jpg',
        size: '50ml',
      },
    ];

    component.searchItem = 'blue';
    let result = component.filteredSearch();
    expect(result.length).toBe(1);
    expect(result[0].product_name).toBe('Pilot Blue');

    component.searchItem = 'diamine';
    result = component.filteredSearch();
    expect(result.length).toBe(1);
    expect(result[0].manufacturer).toBe('Diamine');

    component.searchItem = 'turquoise';
    result = component.filteredSearch();
    expect(result.length).toBe(1);
    expect(result[0].color).toBe('Turquoise');

    component.searchItem = 'green';
    result = component.filteredSearch();
    expect(result.length).toBe(0);
  });
});
