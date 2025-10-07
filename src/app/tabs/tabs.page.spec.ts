/* import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TabsPage } from './tabs.page';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsPage],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test to check if the correct number of ion-buttons are rendered
  it('should render the 5 buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tabBar = compiled.querySelector('ion-tab-bar');
    expect(tabBar).toBeTruthy();
    console.log(tabBar);

    const buttons = tabBar?.querySelectorAll('ion-tab-button');
    console.log(buttons);
    expect(buttons?.length).toBe(5);
  });

  // Test to check if first button in tab-bar is mainpage
  it('should have the first button as mainpage', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tabBar = compiled.querySelector('ion-tab-bar');
    const buttons = tabBar?.querySelectorAll('ion-tab-button');

    const firstButton = buttons?.[0];
    expect(firstButton).toBeTruthy();
    if (firstButton) {
      expect(firstButton.getAttribute('tab')).toBe('mainpage');
    } else {
      fail('First button not found');
    }
  });
});
 */
