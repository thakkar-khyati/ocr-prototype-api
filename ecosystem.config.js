module.exports = {
  apps: [
    {
      name: "user-app",
      script: "index.js",
      instances: 1,
      watch: true,
      ignore_watch: ["images"],
      watch_options: {
        followSymlinks: false,
      },
      autorestart: true,
      max_memory_restart: "1G",
      exec_mode: "cluster",
    },
  ],
};
