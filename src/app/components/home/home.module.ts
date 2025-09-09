import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

import { NavbarComponent } from './components/navbar/navbar.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ServicesComponent } from './components/services/services.component';
import { AboutComponent } from './components/about/about.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CoursesComponent } from './components/courses/courses.component';
import { TeamComponent } from './components/team/team.component';
import { TestimonialComponent } from './components/testimonial/testimonial.component';
import { FooterComponent } from './components/footer/footer.component';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';


@NgModule({
  declarations: [
    HomeComponent,
    NavbarComponent,
    SpinnerComponent,
    CarouselComponent,
    ServicesComponent,
    AboutComponent,
    CategoriesComponent,
    CoursesComponent,
    TeamComponent,
    TestimonialComponent,
    FooterComponent,
    BackToTopComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
