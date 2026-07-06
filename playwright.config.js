// ============================================================
// AVOID Store - playwright.config.js
// Configuracion para @playwright/test runner
// Apunta a Live Server por defecto: http://127.0.0.1:5500
// ============================================================

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Directorio donde buscar los tests
  testMatch: ['playwright_avoid.js'],

  // Timeout por test (ms)
  timeout: 30000,

  // Reintentos en caso de fallo
  retries: 1,

  // Reporters
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],

  // Configuracion global
  use: {
    // URL base - Live Server por defecto
    // Cambia a http://127.0.0.1:5500 o al puerto que use tu Live Server
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:5500',

    // Modo headless (true = sin ventana, false = con ventana visible)
    headless: true,

    // Viewport
    viewport: { width: 1280, height: 800 },

    // Screenshot en fallo
    screenshot: 'only-on-failure',

    // Video en fallo
    video: 'retain-on-failure',

    // Ignorar errores HTTPS (util si usas localhost)
    ignoreHTTPSErrors: true,
  },

  // Proyectos - navegadores a usar
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Descomenta para testear en Firefox y Safari:
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Directorio de salida de artefactos (screenshots, videos)
  outputDir: 'test-results/',
});
