import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import {
  PublicInk,
  UserInk,
  Customer,
  CustomerCreation,
  User,
} from 'src/interface';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const apiUrl = 'https://clm40y4tg0.execute-api.eu-north-1.amazonaws.com'; //from api.service.ts
  const mockPublicInk: PublicInk = {
    ink_id: 0,
    recalled: false,
    product_name: 'Ink A',
    image_url: 'urlA',
    manufacturer: '',
    color: '',
    size: '',
  };

  const mockUserInk: UserInk = {
    user_ink_id: 0,
    batch_number: 'ABC123',
    opened_at: new Date('2025-01-01'),
    expires_at: new Date('2030-01-01'),
    favorite: true,
    publicink_ink_id: 0,
    product_name: 'Akun muste',
    manufacturer: 'Ankkalinnan musteet',
    color: 'Black',
    recalled: false,
    image_url: 'exampleURL',
    size: '100ml',
    User_user_id: 'id-here',
  };

  const mockUser: User = {
    user_id: 'id-here',
    email: 'test@mail.com',
    password: 'password',
    first_name: 'User',
    last_name: 'Usersson',
  };

  const mockCustomer: Customer = {
    customer_id: 0,
    email: 'testi@mail.com',
    phone: '',
    first_name: 'Asiakas',
    last_name: 'Testaaja',
    notes: '',
    User_user_id: 'id-here',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // test if all public inks can be found
  it('should fetch all public inks', () => {
    const mockData: PublicInk[] = [mockPublicInk];

    service.getAllPublicInks().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${apiUrl}/publicInk`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  // test if one public ink can be found by id
  it('should fetch one public ink by ID', () => {
    const id = 0;

    service.getOnePublicInk(id).subscribe((data) => {
      expect(data).toEqual(mockPublicInk);
    });

    const req = httpMock.expectOne(`${apiUrl}/publicInk/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPublicInk);
  });

  // test if all own inks can be found
  it('should fetch all own inks', () => {
    const mockData: UserInk[] = [mockUserInk];

    service.getAllUserInks().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${apiUrl}/userInk`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  // test if one own ink can be found by id
  it('should fetch one own ink by ID', () => {
    const id = 0;

    service.getOneUserInk(id).subscribe((data) => {
      expect(data).toEqual(mockUserInk);
    });

    const req = httpMock.expectOne(`${apiUrl}/userInk/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserInk);
  });

  // test if all customers can be found
  it('should fetch all customers', () => {
    const mockCustomers: Customer[] = [mockCustomer];

    service.getAllCustomers().subscribe((data) => {
      expect(data).toEqual(mockCustomers);
    });

    const req = httpMock.expectOne(`${apiUrl}/customer`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCustomers);
  });

  // TODO: add entry tests later on
});
