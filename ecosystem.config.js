module.exports = {
  apps: [
    {
      name: 'eyns-backend',
      script: 'src/server.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: process.env.SERVER_PORT || 3001
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true,
      max_memory_restart: '1G',
      kill_timeout: 5000,
      listen_timeout: 10000,
      restart_delay: 4000
    },
    {
      name: 'eyns-frontend',
      script: 'serve',
      args: '-s build -l ' + (process.env.PORT || 3000),
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log',
      time: true,
      max_memory_restart: '1G'
    }
  ],

  deploy: {
    production: {
      user: process.env.DEPLOY_USER || 'deploy',
      host: process.env.DEPLOY_HOST || 'localhost',
      ref: 'origin/main',
      repo: 'https://github.com/' + (process.env.GITHUB_ORGANIZATION || 'jamesenki') + '/eyns-ai-experience-center.git',
      path: process.env.DEPLOY_PATH || '/var/www/eyns-ai-center',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-deploy-local': 'echo "Deploying to production server..."'
    }
  }
};