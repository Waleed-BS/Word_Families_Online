
function subscribeToTimer(cb, socket) {
  // listen to timer in express server to emit new Date()
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
}

export { subscribeToTimer };
