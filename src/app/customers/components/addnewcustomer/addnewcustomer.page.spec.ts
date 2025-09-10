import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddnewcustomerPage } from './addnewcustomer.page';

describe('AddnewcustomerPage', () => {
  let component: AddnewcustomerPage;
  let fixture: ComponentFixture<AddnewcustomerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewcustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
