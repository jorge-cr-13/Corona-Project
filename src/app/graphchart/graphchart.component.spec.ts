import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphchartComponent } from './graphchart.component';

describe('GraphchartComponent', () => {
  let component: GraphchartComponent;
  let fixture: ComponentFixture<GraphchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
