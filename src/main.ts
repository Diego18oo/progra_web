import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';
import { routes } from './app/app.routes';


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
