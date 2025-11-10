import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CustomersPage } from './customers.page';

describe('CustomersPage', () => {
  let component: CustomersPage;
  let fixture: ComponentFixture<CustomersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CustomersPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should filter customers by search term', () => {
    component.allcustomers = [
      {
        customer_id: 1,
        first_name: 'Tapio',
        last_name: 'Testinen',
        email: 'tapio@example.com',
        phone: '0401234567',
        notes: 'Testiasiakas',
        User_user_id: 'test',
      },
      {
        customer_id: 2,
        first_name: 'Matti',
        last_name: 'Meikäläinen',
        email: 'matti@example.com',
        phone: '0507654321',
        notes: '',
        User_user_id: 'test',
      },
    ];

    // Testataan etunimellä
    component.searchItem = 'tapio';
    let result = component.filteredCustomers();
    expect(result.length).toBe(1);
    expect(result[0].first_name).toBe('Tapio');

    // Testataan sukunimellä
    component.searchItem = 'meikäläinen';
    result = component.filteredCustomers();
    expect(result.length).toBe(1);
    expect(result[0].last_name).toBe('Meikäläinen');

    // Testataan sähköpostilla
    component.searchItem = 'matti@';
    result = component.filteredCustomers();
    expect(result.length).toBe(1);
    expect(result[0].email).toBe('matti@example.com');

    // Testataan tyhjällä hakusanalla
    component.searchItem = '';
    result = component.filteredCustomers();
    expect(result.length).toBe(2);

    // Testataan ei-osuvalla hakusanalla
    component.searchItem = 'xyz';
    result = component.filteredCustomers();
    expect(result.length).toBe(0);
  });
});
