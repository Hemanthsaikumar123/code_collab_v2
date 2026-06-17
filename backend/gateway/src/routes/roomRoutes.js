const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const router = express.Router();

router.use("/",
  createProxyMiddleware({
    target: process.env.ROOM_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/": "/api/rooms/"
    }
  })
);

module.exports = router;