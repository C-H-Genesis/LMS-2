import { Component, OnInit } from '@angular/core';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle
} from 'ng-apexcharts';
import { EnrollmentWithCourse } from '../../DTOs/EnrollCoursesDto';
import { AdminService, MonthlyUserStat, UserDto } from '../../services/admin.service';


export interface ChartOptions {
  series:     ApexAxisChartSeries;
  chart:      ApexChart;
  xaxis:      ApexXAxis;
  title:      ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],  // ← fixed typo
  standalone: false, 
})
export class AdminDashboardComponent implements OnInit {
      public usersChartOptions!:      ChartOptions;
      public enrollmentsChartOptions!: ChartOptions;

      

      constructor (private adminService: AdminService){}

    ngOnInit() {
    this.loadUserStatsChart();
    this.loadEnrollmentStatsChart();
  }

private loadUserStatsChart() {
  this.adminService.getMonthlyUserStats()
    .subscribe((stats: MonthlyUserStat[]) => {
      // 1️⃣ Build labels: e.g. “Jan 2025”
      const labels = stats.map(s =>
        new Date(s.year, s.month - 1)
          .toLocaleString('default', { month: 'short', year: 'numeric' })
      );

      // 2️⃣ Extract the counts in the same order
      const data = stats.map(s => s.count);

      // 3️⃣ Assign chart options
      this.usersChartOptions = {
        series: [{ name: 'New Users', data }],
        chart:  { type: 'line', height: 300 },
        xaxis:  { categories: labels },
        title:  { text: 'Monthly New User Registrations' },
        dataLabels: { enabled: false }
      };
    }, err => {
      console.error('Could not load monthly user stats', err);
    });
}




  private loadEnrollmentStatsChart(): void {
    this.adminService.getEnrollmentsWithCourse()
      .subscribe((enrollments: EnrollmentWithCourse[]) => {
        // Group enrollments by courseName
        const countsByCourse = enrollments.reduce((acc, e) => {
          acc[e.courseName] = (acc[e.courseName] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const categories = Object.keys(countsByCourse);
        const data       = Object.values(countsByCourse);

        this.enrollmentsChartOptions = {
          series:     [{ name: 'Enrollments', data }],
          chart:      { type: 'bar', height: 300 },
          xaxis:      { categories },
          title:      { text: 'Course Enrollments by Subject' },
          dataLabels: { enabled: false }
        };
      }, err => {
        console.error('Could not load enrollments:', err);
        
      });
  }
}