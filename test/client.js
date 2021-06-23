console.log(window);

// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:3000');

// Connection opened
socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({ type: 'HOST' }));
});

// Listen for messages
socket.addEventListener('message', function (event) {
    const packet = JSON.parse(event.data);

    switch (packet.type) {
      // server -> host
      case 'ROOM_IS_CREATED':
        // HOST
        // RECIEVE KEY FROM HOST
        // MOVE ON TO HOST SCREEN
      break;

      // client -> host
      case 'REQUEST_TO_JOIN':
        // HOST
        // assign player ID and forward on "CONFIRM_JOIN"
        // update player array
      break;

      // client -> host
      case 'UPDATE_HOST':
        // HOST
        // UPDATE STATE FOR SPECIFIED PLAYER ID
      break;

      // host -> client
      case 'CONFIRM_JOIN':
        // CLIENT
        // RECIEVE PLAYER ID
        // MOVE TO HOSTED SCREEN
        // START RECIEVING HOST UPDATES
      break;

      // host -> client
      case 'UPDATE_CLIENT':
        // CLIENT
        // PARSE UPDATE FROM HOST
      break;

      default:
      break;
    }
});