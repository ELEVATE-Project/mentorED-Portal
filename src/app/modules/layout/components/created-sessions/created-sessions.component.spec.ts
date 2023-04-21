import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedSessionsComponent } from './created-sessions.component';

describe('CreatedSessionsComponent', () => {
  let component: CreatedSessionsComponent;
  let fixture: ComponentFixture<CreatedSessionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatedSessionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatedSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
