import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InksPage } from './inks.page';

describe('InksPage', () => {
  let component: InksPage;
  let fixture: ComponentFixture<InksPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
