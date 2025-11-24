module.exports = {
  apps: [
    {
      name: 'catalog-backend',
      script: 'src/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      // Pre-start script to clone/update repositories
      pre_stop: 'echo "Stopping catalog backend..."',
      // Run clone script before starting server
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'repository-cloner',
      script: '/bin/sh',
      args: ['./scripts/clone-repositories.sh'],
      autorestart: false,  // Only run once on startup
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/clone-error.log',
      out_file: './logs/clone-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
