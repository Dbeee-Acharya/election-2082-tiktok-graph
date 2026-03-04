module.exports = {
  apps: [
    {
      name: "election",
      script:
        "/usr/share/nginx/socialmedia-election.ekantipur.com/election-2082-tiktok-graph/.output/server/index.mjs",

      // fork mode (default, but explicit)
      exec_mode: "fork",
      instances: 1,

      // env vars
      env: {
        PORT: 5001,
      },

      // restart rules
      max_memory_restart: "500M",
      autorestart: true,

      // optional but good
      time: true,
      watch: false,
    },
  ],
};
