
module.exports = {
  apps: [
    {
      name: "user-app",
      script: "index.js",
      watch: true,
      instances: 1,
      autorestart: true,
      max_memory_restart: "1G",
      exec_mode: "cluster",
    },
  ],
};
