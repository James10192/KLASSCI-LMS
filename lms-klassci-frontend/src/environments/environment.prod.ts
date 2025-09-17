export const environment = {
  production: true,
  klassciApiUrl: 'https://your-klassci-domain.com/api',
  klassciBaseUrl: 'https://your-klassci-domain.com',
  appName: 'LMS KLASSCI',
  version: '1.0.0',
  enableLogging: false,
  enableAdvancedEffects: true,
  performanceMode: 'auto', // 'auto' | 'high' | 'low'
  features: {
    liquidGlass: true,
    liquidDistortion: true,
    advancedAnimations: true,
    realTimeChat: true,
    videoConference: true,
    offlineMode: true
  },
  api: {
    timeout: 30000,
    retryAttempts: 2,
    cacheTimeout: 600000 // 10 minutes
  }
};