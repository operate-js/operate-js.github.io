const WebSocket = require('ws');
const PORT = process.env.PORT || 3000;

console.log(`启动 WebSocket 服务，端口: ${PORT}`);

const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws) => {
  console.log('新客户端连接');
  ws.send('已连接到WebSocket服务器');
  
  ws.on('message', (data) => {
    console.log(`收到消息: ${data}`);
    
    // 广播消息
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`[广播] ${data}`);
      }
    });
    
    ws.send(`服务器收到: ${data}`);
  });
  
  ws.on('close', () => console.log('客户端断开连接'));
});

wss.on('error', (error) => {
  console.error('服务器错误:', error);
});
