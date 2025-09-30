import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddnewinkPage } from './addnewink.page';

describe('AddnewinkPage', () => {
  let component: AddnewinkPage;
  let fixture: ComponentFixture<AddnewinkPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewinkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // test to check if at least one ink is rendered in the template
  it('should render at least one ink', () => {
    // Mock the filteredInks function to return one ink
    spyOn(component, 'filteredInks').and.returnValue([
      {
        id: 1,
        product_name: 'Test Ink',
        manufacturer: 'Test Co.',
        color: 'Blue',
        imageUrl: 'test.jpg',
      },
    ]);
    const inkclass = 'div.bg-blue-800'; // Change this to the actual class used for ink items
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const inkElements = compiled.querySelectorAll(inkclass);
    expect(inkElements.length).toBeGreaterThan(0);
  });
});
