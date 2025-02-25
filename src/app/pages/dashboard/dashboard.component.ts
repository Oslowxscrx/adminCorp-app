import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { ProyectosService } from '../../service/proyectos.service';
import { ActividadesService } from '../../service/actividades.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NzStatisticModule, NzIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  proyectosCount: number = 0;
  actividadesCount: number = 0;
  proyectosPorMes: number[] = Array(12).fill(0);
  actividadesPorMes: number[] = Array(12).fill(0);

  constructor(
    private proyectosService: ProyectosService,
    private actividadesService: ActividadesService
  ) {}

  ngOnInit(): void {
    this.getProyectosCount();
    this.getActividadesCount();
    this.getProyectosPorMes();
    this.getActividadesPorMes();
  }

  getProyectosCount(): void {
    this.proyectosService.getProyectos().subscribe((proyectos) => {
      this.proyectosCount = proyectos.length;
    });
  }

  getActividadesCount(): void {
    this.actividadesService.getActividad().subscribe((actividades) => {
      this.actividadesCount = actividades.length;
    });
  }

  getProyectosPorMes(): void {
    this.proyectosService.getProyectos().subscribe((proyectos) => {
      proyectos.forEach((proyecto) => {
        const mes = new Date(proyecto.createAt).getMonth();
        this.proyectosPorMes[mes]++;
      });
      this.initProyectosChart();
    });
  }

  getActividadesPorMes(): void {
    this.actividadesService.getActividad().subscribe((actividades) => {
      actividades.forEach((actividad) => {
        const mes = new Date(actividad.createAt).getMonth();
        this.actividadesPorMes[mes]++;
      });
      this.initActividadesChart();
    });
  }

  initProyectosChart(): void {
    const ctx = document.getElementById('proyectosChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [{
          label: 'Proyectos Creados',
          data: this.proyectosPorMes,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  initActividadesChart(): void {
    const ctx = document.getElementById('actividadesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: [{
          label: 'Actividades Creadas',
          data: this.actividadesPorMes,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}