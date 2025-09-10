import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalinkPage } from './modalink.page';

describe('ModalinkPage', () => {
  let component: ModalinkPage;
  let fixture: ComponentFixture<ModalinkPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalinkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
