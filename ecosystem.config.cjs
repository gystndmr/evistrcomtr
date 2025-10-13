module.exports = {
  apps: [
    {
      name: 'evisatr-api',
      cwd: '/var/www/evistrcomtr',
      script: 'dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
        SENDGRID_API_KEY: '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', // buraya YENİ key
        // SENDGRID_FROM: 'no-reply@evisatr.com.tr'
      }
    }
  ]
}

