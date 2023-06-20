module.exports = {
  apps: [
    {
      name: "ocr-user-app",
      script: "index.js",
      watch: true,
      instances: 4,
      autorestart: true,
      max_memory_restart: "1G",
    },
  ],
};
