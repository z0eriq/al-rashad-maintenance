/** تشغيل الموقع على السيرفر باستخدام PM2 */
module.exports = {
  apps: [
    {
      name: "al-rashad",
      cwd: __dirname,
      script: "node",
      args: ".next/standalone/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
    },
  ],
};
