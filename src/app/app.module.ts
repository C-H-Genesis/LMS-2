import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { TeacherDashboardComponent } from './components/teacher-dashboard/teacher-dashboard.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { FinanceDashboardComponent } from './components/finance-dashboard/finance-dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StudentFeesComponent } from './components/student-fees/student-fees.component';
import { CourseRegistrationComponent } from './components/course-registration/course-registration.component';
import { GradesComponent } from './components/grades/grades.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TeacherMyCoursesComponent } from './components/teacher-my-courses/teacher-my-courses.component';
import { TeacherAssignmentsComponent } from './components/teacher-assignments/teacher-assignments.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { ManageCoursesComponent } from './components/manage-courses/manage-courses.component';
import { ReportsComponent } from './components/reports/reports.component';
import { StudentAssignmentComponent } from './components/student-assignment/student-assignment.component';
import { LearningDashboardComponent } from './components/learning-dashboard/learning-dashboard.component';
import { CollapseModule } from '@coreui/angular';
import { NavbarModule } from '@coreui/angular';
import { NavModule } from '@coreui/angular';
import { ButtonModule } from '@coreui/angular';
import { SharedModule } from '@coreui/angular';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AboutComponent } from './components/about/about.component';
import { CoursesComponent } from './components/courses/courses.component';
import { ContactComponent } from './components/contact/contact.component'; // For <c-container>
import { HomeModule } from './components/home/home.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { TeacherProfileComponent } from './components/teacher-profile/teacher-profile.component';
import { TimeTableComponent } from './components/time-table/time-table.component';
import { TeacherSubmissionComponent } from './components/teacher-submission/teacher-submission.component';
import { FacultiesComponent } from './components/faculties/faculties.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { ResultComponent } from './components/result/result.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    StudentDashboardComponent,
    TeacherDashboardComponent,
    AdminDashboardComponent,
    FinanceDashboardComponent,
    NavbarComponent,
    StudentFeesComponent,
    CourseRegistrationComponent,
    GradesComponent,
    ProfileComponent,
    TeacherMyCoursesComponent,
    TeacherAssignmentsComponent,
    ManageUsersComponent,
    ManageCoursesComponent,
    ReportsComponent,
    StudentAssignmentComponent,
    LearningDashboardComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AboutComponent,
    CoursesComponent,
    ContactComponent,
    AdminProfileComponent,
    TeacherProfileComponent,
    TimeTableComponent,
    TeacherSubmissionComponent,
    FacultiesComponent,
    UnauthorizedComponent,
    ResultComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomeModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule ,
    CollapseModule,
    NavbarModule,
    NavModule,
    ButtonModule,
    SharedModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgApexchartsModule
   
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }



