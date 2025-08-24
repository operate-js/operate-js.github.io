const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// 安全中间件
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

// 自定义CORS中间件
const allowedOrigins = [
  'https://operate-js.github.io',
  'file:///C:/Users/admin/Downloads/java%E7%89%88v5%20-%20%E5%89%AF%E6%9C%AC.html'
];

app.use((req, res, next) => {
  const origin = req.headers.origin || req.headers.referer;
  
  // 检查来源是否在允许列表中
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  
  // 预检请求处理
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// 密钥端点
app.get('/api/key', (req, res) => {
  const origin = req.headers.origin || req.headers.referer;
  
  // 验证来源
  if (!allowedOrigins.includes(origin)) {
    console.warn(`Access denied for origin: ${origin}`);
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // 返回密钥（实际应用中应从安全存储获取）
  res.json({
    key: "VmpKd1MyTXdNVWhTYTJ4WFlsZDRXbFJVUWt0aU1YQkdWMVJTYkZKVVJsZFZNblJUVldzeFIyTkdhRlZXUlVwNVdrUktWMUpYU2tkaFJuQnBVak5vTVZkc1pEUlNNRFZIVjJ0V1UySkhhRnBVVlZKelpHeHNXV05IT1ZaU01GcDVXbFZTVDFaWFNsZFRWRUpYVWpOb2VsWnJWVEZXTVZaeVpFZHdUbUpGY0hwV1YzUnJWREF3ZVZWdVVsTmhiRnBSVld0a2IxVkdXa2RWYXpsVFZtdHNNMXBJY0ZkaFJscDBXa1JPVm1GclduSlpiWGhhWld4T1ZWRnNTbGRXVm5CS1ZteFdWMk14V1hoVVdHUlRZa1p3VkZsc1pGTmxiR3QzVm01a1QxcDZNRGs9"
  });
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// SSL证书配置（实际部署中应使用真实证书）
const sslOptions = {
  key: fs.readFileSync('./ssl/private-key.pem'),  // 替换为您的私钥路径
  cert: fs.readFileSync('./ssl/certificate.pem')  // 替换为您的证书路径
};

// 启动HTTPS服务器
const PORT = process.env.PORT || 3443;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Secure key server running on port ${PORT}`);
});
