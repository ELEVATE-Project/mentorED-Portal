import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinDialogBoxComponent } from './join-dialog-box.component';

describe('JoinDialogBoxComponent', () => {
  let component: JoinDialogBoxComponent;
  let fixture: ComponentFixture<JoinDialogBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinDialogBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinDialogBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
