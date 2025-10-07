import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EntrymainpagePage } from './entrymainpage.page';

describe('EntrymainpagePage', () => {
  let component: EntrymainpagePage;
  let fixture: ComponentFixture<EntrymainpagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrymainpagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
