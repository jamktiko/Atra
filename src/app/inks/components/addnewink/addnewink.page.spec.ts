/* import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddnewinkPage } from './addnewink.page';

describe('AddnewinkPage', () => {
  let component: AddnewinkPage;
  let fixture: ComponentFixture<AddnewinkPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewinkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should pass', () => {
    expect(true).toBeTrue();
  });

  //commented out temporarily
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // test to check if at least one ink is rendered in the template
  it('should render at least one ink', () => {
    // Mock the filteredInks function to return one ink
    spyOn(component, 'filteredInks').and.returnValue([
      {
        ink_id: '123abc',
        product_name: 'Test Ink',
        manufacturer: 'Test Co.',
        color: 'Blue',
        imageUrl: 'test.jpg',
        image_url: 'test.jpg',
      },
    ]);
    const inkclass = 'div.bg-blue-800'; // Change this to the actual class used for ink items
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const inkElements = compiled.querySelectorAll(inkclass);
    expect(inkElements.length).toBeGreaterThan(0);
  });

  //test if adding an ink is successful
  //inkGroup holds the form group for the new inks, use chooseInk() to add an ink to the form array,
  //use getChosenInks() to get the array of chosen inks, check length
  it('should add an ink to chosenInks', () => {
    const initialLength = component.getChosenInks().length;
    const testInk = {
      ink_id: 99,
      product_name: 'Test Ink',
      manufacturer: 'Test Co.',
      color: 'Blue',
      recalled: false,
      imageUrl: 'test.jpg',
      image_url: 'test.jpg',
      size: '30ml',
    };
    component.chooseInk(testInk);
    const newLength = component.getChosenInks().length;
    expect(newLength).toBe(initialLength + 1);
  });
});
 */
