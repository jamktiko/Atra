import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EntriesPage } from './entries.page'; // tai oikea polku
import { ApiService } from '../services/api.service'; // tai oikea polku

describe('EntriesPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        EntriesPage, // jos tämä on standalone-komponentti
      ],
      providers: [ApiService],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EntriesPage);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
