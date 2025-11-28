//temporarily commented out; apiservice changes will change code structure, implement once stabile

/*
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { PublicInk, UserInk, Customer, User } from 'src/interface';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const apiUrl = 'environment.apiUrl'; //from api.service.ts

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
    image_url:
      'https://www.nordictattoosupplies.com/WebRoot/NTS/Shops/24052010-172317/6290/AF57/6C16/A84A/5F39/0A28/1066/1F1F/DV30UNION_m.jpg',
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

  // TODO: add more tests later on
});
 */
