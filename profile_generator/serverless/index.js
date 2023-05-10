const serverless = require("serverless-http");
const express = require("express");
const axios = require("axios");
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json())

app.post("/get", (req, res, next) => {
  let { url } = req.body;

  // 返回axios请求结果
  axios.get(url).then((response) => {
    let { data } = response;
    let reg = /^{.*?}/;
    // 去除data前面的 {.*}, 保持后面的部分
    let _ = data.match(reg)[0];
    data = data.replace(_, "");

    // 将data解析为JSON格式，返回给前端
    return res.status(200).json(JSON.parse(data));
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
// app.listen(3000, () => {console.log("服务启动成功");})
