module.exports = {
  apps: [
    {
      name: 'holy-cross-backend',
      script: 'dist/server.js',
      instances: process.env.NODE_ENV === 'production' ? 'max' : 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 5000,
        DATABASE_URL: 'file:./prisma/dev.db',
        JWT_SECRET: 'your-dev-jwt-secret',
        FRONTEND_URL: 'http://localhost:3000',
        BASE_URL: 'http://localhost:5000'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        DATABASE_URL: process.env.DATABASE_URL || 'file:./prisma/prod.db',
        JWT_SECRET: process.env.JWT_SECRET,
        FRONTEND_URL: process.env.FRONTEND_URL || 'https://holycrossbrooklyn.edu',
        BASE_URL: process.env.BASE_URL || 'https://api.holycrossbrooklyn.edu'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      watch: process.env.NODE_ENV === 'development' ? ['dist'] : false,
      ignore_watch: ['node_modules', 'logs'],
      watch_options: {
        followSymlinks: false
      },
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000,
      listen_timeout: 3000,
      shutdown_with_message: true
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: process.env.PRODUCTION_HOST || 'your-server.com',
      ref: 'origin/main',
      repo: 'https://github.com/holycrossbrooklyn/website.git',
      path: '/var/www/holy-cross-backend',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production && pm2 save',
      'pre-setup': '',
      ssh_options: 'StrictHostKeyChecking=no'
    },
    staging: {
      user: 'deploy',
      host: process.env.STAGING_HOST || 'staging-server.com',
      ref: 'origin/develop',
      repo: 'https://github.com/holycrossbrooklyn/website.git',
      path: '/var/www/holy-cross-backend-staging',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging && pm2 save',
      'pre-setup': '',
      ssh_options: 'StrictHostKeyChecking=no'
    }
  }
};





