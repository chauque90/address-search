import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTileComponent } from './simple-tile.component';

describe('SimpleTileComponent', () => {
  let component: SimpleTileComponent;
  let fixture: ComponentFixture<SimpleTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
