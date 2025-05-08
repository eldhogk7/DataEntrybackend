module.exports = {
    apps: [
      {
        name: "backend",
        script: "server.js", // Replace with your entry point file (e.g., app.js or server.js)
        instances: 1,
      exec_mode: "fork",
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  