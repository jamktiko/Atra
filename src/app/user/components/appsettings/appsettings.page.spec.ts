import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppsettingsPage } from './appsettings.page';

describe('AppsettingsPage', () => {
  let component: AppsettingsPage;
  let fixture: ComponentFixture<AppsettingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AppsettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
