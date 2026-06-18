const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const router = express.Router();

router.use("/",
  createProxyMiddleware({
    target: process.env.RUNNER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/": "/api/run/"
    }
  })
);

module.exports = router;