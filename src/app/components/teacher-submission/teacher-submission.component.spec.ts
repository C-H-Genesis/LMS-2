import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherSubmissionComponent } from './teacher-submission.component';

describe('TeacherSubmissionComponent', () => {
  let component: TeacherSubmissionComponent;
  let fixture: ComponentFixture<TeacherSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TeacherSubmissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
