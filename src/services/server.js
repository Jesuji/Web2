/* 서버 초기화 및 실행  */
//node src/services/server.js

const express = require('express');
const http = require('http');
const cors = require('cors');
const { PORT } = require('./config');
const { initializeWebSocket } = require('./socket');
const { getData } = require('./api');

const app = express();
const server = http.createServer(app);

// CORS 설정
app.use(cors());
app.use(express.json());

// 기본 API 라우트
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// 예제: 외부 API 호출
app.get('/api/data', async (req, res) => {
  try {
    const data = await getData('/external-api-endpoint');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '데이터를 불러오는 데 실패했습니다.' });
  }
});

// WebSocket 초기화
initializeWebSocket(server);

// 서버 시작
server.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});