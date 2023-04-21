import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorDirectoryComponent } from './mentor-directory.component';

describe('MentorDirectoryComponent', () => {
  let component: MentorDirectoryComponent;
  let fixture: ComponentFixture<MentorDirectoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MentorDirectoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentorDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
