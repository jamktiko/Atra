import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EntriesPage } from './entries.page';
import { ApiService } from '../services/api.service';
import { of, throwError } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';

describe('EntriesPage', () => {
  let component: EntriesPage;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastService: jasmine.SpyObj<NgToastService>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', [
      'getAllEntries',
      'getOneEntry',
      'deleteEntry',
    ]);
    const toastSpy = jasmine.createSpyObj('NgToastService', [
      'success',
      'warning',
    ]);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, EntriesPage],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: NgToastService, useValue: toastSpy },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(EntriesPage);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastService = TestBed.inject(
      NgToastService
    ) as jasmine.SpyObj<NgToastService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //temporarily commented out until filteredsearch is stabile
  /*   it('should load entries and sort by date', () => {
    const mockEntries = [
      { entry_date: '2025-11-18', entry_id: 1 },
      { entry_date: '2025-11-17', entry_id: 2 },
    ] as any;

    apiService.getAllEntries.and.returnValue(of(mockEntries));
    component.loadEntries();

    expect(component.entries.length).toBe(2);
    expect(component.groupedEntries[0].date).toBe('2025-11-18');
  });*/

  it('should handle loadEntries error', () => {
    apiService.getAllEntries.and.returnValue(
      throwError(() => new Error('Error'))
    );
    component.loadEntries();
    expect(toastService.warning).toHaveBeenCalledWith('Something went wrong');
  });

  it('should choose entry and open modal', () => {
    const mockEntry = { entry_id: 1, entry_date: '2025-11-18' } as any;
    apiService.getOneEntry.and.returnValue(of(mockEntry));

    component.chooseEntry(true, 1);
    expect(component.chosenEntry).toEqual(mockEntry);
    expect(component.singleEntryModal).toBeTrue();
  });

  it('should delete entry and reload', () => {
    const mockEntry = { entry_id: 1 } as any;
    apiService.deleteEntry.and.returnValue(of(mockEntry));

    spyOn(component, 'loadEntries');
    component.deleteEntry(mockEntry);

    expect(toastService.success).toHaveBeenCalledWith(
      'Entry deleted successfully'
    );
    expect(component.loadEntries).toHaveBeenCalled();
  });

  //temporarily commented out until filteredsearch is stabile
  /*   it('should sort entries by date descending', () => {
    const mockEntries = [
      { entry_date: '2025-11-17' },
      { entry_date: '2025-11-18' },
    ] as any;

    component.sortByDate(mockEntries);
    expect(component.groupedEntries[0].date).toBe('2025-11-18');
  }); */

  it('should handle modal close', () => {
    spyOn(component, 'loadEntries');
    component.handleClosed();
    expect(component.singleEntryModal).toBeFalse();
    expect(component.loadEntries).toHaveBeenCalled();
  });
});
