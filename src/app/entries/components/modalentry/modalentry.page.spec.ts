import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalentryPage } from './modalentry.page';

describe('ModalentryPage', () => {
  let component: ModalentryPage;
  let fixture: ComponentFixture<ModalentryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalentryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
