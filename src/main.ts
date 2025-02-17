import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,  // Mantener los providers actuales de appConfig
    provideHttpClient()  // Agregar provideHttpClient aquí
  ]
})
  .catch((err) => console.error(err));
