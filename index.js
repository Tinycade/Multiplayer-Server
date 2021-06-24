const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
// uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

const wss = new WebSocket.Server({ port: 3000 });
let host = undefined;
const allClients = {};
/*
  roomID: {
    clients: [],
    host: uuid
  }
*/
const rooms = {}

const roomIdString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function genRandomId(length) {
  let id = '';
  for (let i = 0; i < length; i++) {
    id += radomIdString.charAt(Math.floor(Math.random() * randomIdString.length));
  }

  return id;
}

function createRoomID() {
  let newID = genRandomId(4);
  while(rooms[newID] != undefined) {
    newID = genRandomId(4);
  }

  return newID;
}

/* Packet shape
{
  type: msg type,
  room_key: only for msgs that go to hosts/clients
  payload: array or whatever
}
*/
function createPacket(type, roomKey, payload) {
  return {
    type: type,
    roomKey: roomKey,
    payload: payload,
  };
}

wss.on('connection', function connection(ws) {
  // WHEN CLIENT SOCKET JOINS GENERATE AND ATTACH ID
  ws.tinycadeUUID = uuidv4();
  allClients[ws.tinycadeID] = ws;
  ws.send(createPacket('ASSIGN_SOCKET_ID', '', ws.tinycadeID));

  ws.on('message', function incoming(m) {
    const packet = JSON.parse(m);
    ws.send(m);
    
    switch (packet.type) {
      case 'CREATE_ROOM':
        // GENERATE HOST KEY JACKBOX STYLE
        const newRoomKey = createRoomID();
        rooms[newRoomKey] = {
          clients: [],
          host: ws.tinycadeUUID,
        }
        // SEND KEY TO HOST on "ROOM_IS_CREATED"
        ws.send(JSON.stringify(createPacket('ROOM_IS_CREATED', newRoomKey)));
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
        rooms[packet.roomKey].clients.forEach(c => {
          allClients[c].send(m);
        });
      break;

      case 'UPDATE_HOST':
        // FORWARD TO HOST BASED ON ROOM KEY
        allClients[rooms[packet.roomKey].host].send(m);
      break;

      case 'CLOSE_ROOM':
        // send msg to all clients
        // delete room
      break;

      default:
        // FORWARD TO PLAYER
        rooms[packet.roomKey].clients.forEach(c => {
          allClients[c].send(m);
        });
      break;
    }
  });
});
