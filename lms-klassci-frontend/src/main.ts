import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

// Performance monitoring
if (environment.enableLogging && !environment.production) {
  console.log('🚀 LMS KLASSCI - Starting application');
  console.log('📊 Performance mode:', environment.performanceMode);
  console.log('✨ Advanced effects:', environment.enableAdvancedEffects);
}

// Bootstrap application
bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    if (environment.enableLogging && !environment.production) {
      console.log('✅ LMS KLASSCI - Application started successfully');
    }
  })
  .catch(err => {
    console.error('❌ Error starting LMS KLASSCI:', err);
  });