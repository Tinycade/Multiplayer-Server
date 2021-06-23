const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });
let host = undefined;
const clients = [];

wss.on('connection', function connection(ws) {
  clients.push(ws);

  ws.on('message', function incoming(m) {
    const packet = JSON.parse(m)
    
    switch (packet.type) {
      case 'HOST':
        host = ws;
      break;

      case 'HOST_UPDATE':
      break;

      case 'CLIENT_UPDATE':
      break;

      default:
      break;
    }
  });
});
