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
    id += roomIdString.charAt(Math.floor(Math.random() * roomIdString.length));
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
  roomKey: only for msgs that go to hosts/clients
  payload: array or whatever
}
*/
function createPacket(type, roomKey, payload) {
  return JSON.stringify({
    type: type,
    roomKey: roomKey,
    payload: payload,
  });
}

wss.on('connection', function connection(ws) {
  // WHEN CLIENT SOCKET JOINS GENERATE AND ATTACH ID
  ws.tinycadeUUID = uuidv4();
  allClients[ws.tinycadeUUID] = ws;
  ws.send(createPacket('ASSIGN_SOCKET_ID', '', ws.tinycadeID));

  ws.on('message', function incoming(rawMessage) {
    const packet = JSON.parse(rawMessage);
    // ws.send(m);
    
    switch (packet.type) {
      case 'CREATE_ROOM':
        // GENERATE HOST KEY JACKBOX STYLE
        console.log(ws.tinycadeUUID, 'wants to create a room');
        const newRoomKey = createRoomID();
        rooms[newRoomKey] = {
          clients: [],
          host: ws.tinycadeUUID,
        }
        // SEND KEY TO HOST on "ROOM_IS_CREATED"
        ws.send(createPacket('ROOM_IS_CREATED', newRoomKey));
      break;

      case 'REQUEST_TO_JOIN':
        // SHOULD HAVE HOST KEY
        if (rooms[packet.roomKey]) {
          console.log(ws.tinycadeUUID, 'wants to join room', packet.roomKey);
          const r = rooms[packet.roomKey];
          allClients[r.host].send(createPacket('REQUEST_TO_JOIN', packet.roomKey, ws.tinycadeUUID));
        } else {
          ws.send(createPacket('ROOM_KEY_ERROR', packet.roomKey, 'Room Does Not Exist'));
        }
        // REQUESTS ID FROM HOST, PASS ALONG WS ID

      break;

      case 'CONFIRM_JOIN':
        // SHOULD HAVE CLIENT"S PLAYER ID
        allClients[packet.payload.clientID].send(rawMessage);
        rooms[packet.roomKey].clients.push(packet.payload.clientID);
      break;

      case 'UPDATE_CLIENT':
        // FORWARD TO ALL CLIENTS IN ROOM
        rooms[packet.roomKey].clients.forEach(c => {
          // console.log(packet);
          allClients[c].send(rawMessage);
        });
      break;

      case 'UPDATE_HOST':
        // FORWARD TO HOST BASED ON ROOM KEY
        allClients[rooms[packet.roomKey].host].send(rawMessage);
      break;

      case 'CLOSE_ROOM':
        // send msg to all clients
        // delete room
      break;

      default:
        // console.log('Unhandled Message Type', packet.type);
        // FORWARD TO PLAYER
        rooms[packet.roomKey].clients.forEach(c => {
          allClients[c].send(m);
        });
      break;
    }
  });
});
