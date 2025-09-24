// Node.js Express 프록시 서버: 네이버 Directions API 요청을 대신 처리
import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 4000;

// CORS 미들웨어 추가
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

const CLIENT_ID = 'YOUR_CLIENT_ID'; // 네이버 Cloud API Gateway ID
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET'; // 네이버 Cloud API Gateway Secret

app.get('/directions', async (req, res) => {
  const { start, goal, waypoints } = req.query;
  let url = `https://naveropenapi.apigw.ntruss.com/map-direction-15/v1/driving?start=${start}&goal=${goal}`;
  if (waypoints) url += `&waypoints=${waypoints}`;
  try {
    const response = await fetch(url, {
      headers: {
        'X-NCP-APIGW-API-KEY-ID': '9ce23t2q0v',
        'X-NCP-APIGW-API-KEY': 'Lbw5lsFyk2kxjg6WtkTAdB7p2NpTkPx9HIt5T06U'
      }
    });
    const data = await response.json();
  // CORS 헤더는 미들웨어에서 처리
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
