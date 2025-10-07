import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UniversalmodalPage } from './universalmodal.page';

describe('UniversalmodalPage', () => {
  let component: UniversalmodalPage;
  let fixture: ComponentFixture<UniversalmodalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UniversalmodalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
