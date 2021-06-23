const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 });
let host = undefined;
const clients = [];

wss.on('connection', function connection(ws) {
  // WHEN CLIENT SOCKET JOINS GENERATE AND ATTACH ID
  clients.push(ws);

  ws.on('message', function incoming(m) {
    const packet = JSON.parse(m);
    ws.send(m);
    
    switch (packet.type) {
      case 'CREATE_ROOM':
        // GENERATE HOST KEY JACKBOX STYLE
        host = ws;
        // SEND KEY TO HOST on "ROOM_IS_CREATED"
      break;

      case 'REQUEST_TO_JOIN':
        // SHOULD HAVE HOST KEY
        // REQUESTS ID FROM HOST, PASS ALONG WS ID
      break;

      case 'CONFIRM_JOIN':
        // SHOULD HAVE CLIENT"S PLAYER ID
        // ALSO SHOULD HAVE CLIENT ID
      break;

      case 'UPDATE_CLIENT':
        // FORWARD TO ALL CLIENTS IN ROOM
      break;

      case 'UPDATE_HOST':
        // FORWARD TO HOST BASED ON ROOM KEY
      break;

      default:
        // FORWARD TO PLAYER
      break;
    }
  });
});
