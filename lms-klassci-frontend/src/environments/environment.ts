export const environment = {
  production: false,
  klassciApiUrl: 'http://127.0.0.1:8000/api',
  klassciBaseUrl: 'http://127.0.0.1:8000',
  appName: 'LMS KLASSCI',
  version: '1.0.0',
  enableLogging: true,
  enableAdvancedEffects: true,
  performanceMode: 'auto', // 'auto' | 'high' | 'low'
  features: {
    liquidGlass: true,
    liquidDistortion: true,
    advancedAnimations: true,
    realTimeChat: true,
    videoConference: true,
    offlineMode: false
  },
  api: {
    timeout: 30000,
    retryAttempts: 3,
    cacheTimeout: 300000 // 5 minutes
  }
};