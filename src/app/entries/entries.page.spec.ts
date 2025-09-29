import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntriesPage } from './entries.page';

describe('EntriesPage', () => {
  let component: EntriesPage;
  let fixture: ComponentFixture<EntriesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EntriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
