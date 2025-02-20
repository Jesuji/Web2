/* websocket 연결 및 메시지 전송 */

import WebSocket from 'ws';

let wss;

export const initializeWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
      console.log(`► Received: ${message}`);

      // 모든 클라이언트에 메시지 전송
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
};

//import { initializeWebSocket } from '../services/socket'; 
//import { WS_SERVER_URL } from '../services/config';