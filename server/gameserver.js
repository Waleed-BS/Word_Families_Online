/*
    ./server/gameserver.js
*/

const gameserver = module.exports = { games: {}, game_count: 0, clients: {} }
const UUID = require('node-uuid');
const verbose = true;

gameserver.log = function(logMsg) {
  if(verbose) console.log(logMsg);
};

gameserver.findGame = function(client) {

  this.log('\n looking for a game. We have: ' + this.game_count);
  // if a game or more exists
  if(this.game_count) {
    // flag it to false since we haven't joined yet
    let joined_a_game = false;
    // iterate through all existed games
    for(let gameid in this.games) {
      // skip one iteration if this game doesn't have a property of gameid
      if(!this.games.hasOwnProperty(gameid)) continue;
      // assign this game to game_instance
      const game_instance = this.games[gameid];
      // if this game is not full
      if(game_instance.player_count < 2) {
        // flag it to true since we are joining this game
        joined_a_game = true
        // create a player with the same userID as this socket
        let player = {
          userID: client.userID,
        };
        // assign the joined player to this game
        game_instance.player_client = player;
        // player_client's role is player
        game_instance.player_client.role = 'player';
        // increase the number of players of this game
        game_instance.player_count++;
        // give the socket the id of its current game
        client.currentGameID = game_instance.id
        // store this socket into an array
        this.clients[game_instance.player_client.userID] = client;

        this.log('\n\tplayer ' + player.userID);
        this.log('\tjoined a game ' + game_instance.id)
        this.log('\t' + game_instance.player_count + '/2 in the game')

        // emit the currentGame to client
        client.emit('onWait', { currentGame: game_instance });

        // get host and client sockets
        const client_host = this.clients[game_instance.player_host.userID];
        const client_client = this.clients[game_instance.player_client.userID];

        this.startGame(game_instance, client_host, client_client);

      } // if(game_instance.player_count < 2)

    } // for(let gameid in this.games)

    // if all games are full, create a game
    if(!joined_a_game) {
      this.createGame(client);
    }
  // if nobody created a game yet
  } else {
    this.createGame(client);
  }

}; // findGame()

gameserver.createGame = function(client) {

  // create a player with the same userID as this socket
  let player = {
    userID: client.userID,
  };
  // create a new game instance
  const thegame = {
    id: UUID(),                // generate a new id for the game
    player_host: player,       // so we know who initiated the game
    player_client: null,       // nobody else joined yet, since its new
    player_count: 1,           // currently, the host is the only player in this game
  };
  // player_host's role is director
  thegame.player_host.role = 'director';
  // give the socket too a currentGame
  client.currentGameID = thegame.id
  // Store it in the list of games
  this.games[ thegame.id ] = thegame;
  // Keep track
  this.game_count++;
  // store this socket into an array
  this.clients[thegame.player_host.userID] = client;
  // we are currently hosting this game
  thegame.player_host.hosting = true;
  // log server status
  this.log('\n\tplayer ' + player.userID);
  this.log('\tcreated a game ' + thegame.id)
  this.log('\t' + thegame.player_count + '/2 in the game')
  this.log('\n # of games: ' + this.game_count);
  // emit this game to the client
  client.emit('onWait', { currentGame: thegame });

}; // createGame();

gameserver.startGame = function(game, client_host, client_client) {

  // game is active and it's going to start
  game.active = true;
  this.log('\n\thost ' + game.player_host.userID + ' is the director');
  this.log('\tclient ' + game.player_client.userID + ' is the player');
  this.log('\n\tgame is starting!');
  // emit this game and the player of that game to the host's browser
  client_host.emit('onStartGame', {
    currentGame: game,
    player: game.player_host,
  });
  // emit this game and the player of that game to the client's browser
  client_client.emit('onStartGame', {
    currentGame: game,
    player: game.player_client, // emit player_client to this socket
  });

  // todo: it is ideally to use rooms, i will see what I can do with this later
  // client_host.join('start game room');
  // client_client.join('start game room');

  // When player_host sends the audio record, receive it
  client_host.on('onSendAudioToServer', (data) => {
    this.log('\n\taudio received from host ' + client_host.userID)
    // send the player_client the audio record
    client_client.emit('onSendAudioToClient', { recordedBlob: data.recordedBlob });
    this.log('\taudio is sent to client ' + client_client.userID);
  })

  client_host.on('onSendHighlightToServer', (data) => {
    this.log('\n\trandom highlight received from host ' + client_host.userID);
    // send the player_client the random highlight
    client_client.emit('onSendHighlightToClient', { random_highlight: data.random_highlight });
    this.log('\trandom highlight is sent to client ' + client_client.userID);
  })

}; // startGame()

gameserver.endGame = function(gameid, client) {
  // retrieve the game from its ID
  const thegame = this.games[gameid];
  // if the game exist
  if(thegame) {
    // and if the game has two players, and someone is leaving.
    if(thegame.player_count > 1) {
      // and if the player who's leaving is the host
      if(client.userID == thegame.player_host.userID) {
        this.log('\n\tthe host ' + thegame.player_host.userID + ' has left ');
        // delete the socket of the host player from the global array
        delete this.clients[thegame.player_host.userID];
        // and if there's someone still in the game
        if(thegame.player_client) {
          this.log('\tfinding a new game for player ' + thegame.player_client.userID);
          // the game is not active anymore
          thegame.active = false;
          // the host left, he is no longer hosting this game
          thegame.player_host.hosting = false;
          // retrieve the socket of the player_client
          client_client = this.clients[thegame.player_client.userID];
          // let the client's browser know whats good
          client_client.emit('onDisconnect')
          // find this player a new game
          this.findGame(client_client);
        }
      // if the player who's leaving is the client
      } else {
        this.log('\n\tthe client ' + thegame.player_client.userID + ' has left');
        // delete socket of the client player
        delete this.clients[thegame.player_client.userID];
        // and there's someone still in the game
        if(thegame.player_host) {
          this.log('\tfinding a new game for player ' + thegame.player_host.userID);
          // client left and this game is going to be destroyed
          // therefore I am no longer hosting this game
          thegame.player_host.hosting = false;
          // the game is not active anymore
          thegame.active = false;
          // retrieve the socket of the player_host
          client_host = this.clients[thegame.player_host.userID];
          // let the host's browser know wassup
          client_host.emit('onDisconnect')
          // find this player a new game
          this.findGame(client_host);
        }
      }
    }

    // delete this game from the global array of games
    delete this.games[gameid];
    // decrease the numebr of games
    this.game_count--;

    if(this.game_count === 1) {
      this.log('\n game removed. there is now ' + this.game_count + ' game only' );
    } else {
      this.log('\n game removed. there are now ' + this.game_count + ' games' );
    }
  // if that retrieved game isn't found
  } else {
    this.log('\n that game was not found!');
  }

}; // endGame()
