Games = new Mongo.Collection('games');
OpenChallenges = new Mongo.Collection('openChallenges');
DirectChallenges = new Mongo.Collection('directChallenges');
ChatMessages = new Mongo.Collection('chatMessages');

NEW_GAME_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

if (Meteor.isClient) {
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY',
  });

  Meteor.subscribe('users');
  Meteor.subscribe('games');
  Meteor.subscribe('openChallenges');
  Meteor.subscribe('directChallenges');

  let CHAT_MESSAGES_INCREMENT = 15;

  Session.setDefault('msgsLimit', CHAT_MESSAGES_INCREMENT);

  Meteor.subscribe('chatMessages', Session.get('msgsLimit'));
}

if (Meteor.isServer) {
  Meteor.publish('users', function publishUsers() {
    return Meteor.users.find({});
  });

  Meteor.publish('games', function publishGames() {
    return Games.find({});
  });

  Meteor.publish('openChallenges', function openChallenges() {
    return OpenChallenges.find({});
  });

  Meteor.publish('directChallenges', function directChallenges() {
    return DirectChallenges.find({});
  });

  Meteor.publish('chatMessages', function chatMessages(limit) {
    return ChatMessages.find({}, { limit: limit });
  });

  Accounts.onCreateUser(function addCurrentGamesToNewUser(options, user) {
    user.currentGames = [];

    if (options.profile) {
      user.profile = options.profile;
    }
    return user;
  });

  Meteor.methods({
    switchCurrentGame: function switchCurrentGame(gameId) {
      Meteor.users.update(Meteor.user()._id, {$set: {profile: {currentGame: gameId}}});
    },

    removeCurrentGame: function removeCurrentGame(gameId) {
      Meteor.users.update(Meteor.user()._id, {$pull: {currentGames: {game: gameId}}});
    },

    submitChatMessage: function submitChatMessage(msgBody, user) {
      ChatMessages.insert({body: msgBody, author: user});
    },

    gameSetup: function gameCreator(player1Id, player2Id) {
      let randomNum = _.random(1);

      if (randomNum === 0) {
        Meteor.call('createGame', player1Id, player2Id);
      } else {
        Meteor.call('createGame', player2Id, player1Id);
      }
    },

    createNewBoard: function createNewBoard(gameId) {
      Games.insert({
        _id: gameId,
        fen: NEW_GAME_FEN,
        player1: Meteor.userId(),
      });

      Meteor.users.update(Meteor.userId(), {$set: {profile: {currentGame: gameId}},
                                    $push: {currentGames: {game: gameId, currentOpponent: null}}});
    },

    createGame: function createGame(user1Id, user2Id) {
      let gameId = new Meteor.Collection.ObjectID();

      user1Username = Meteor.users.find(user1Id).fetch()[0].username;
      user2Username = Meteor.users.find(user2Id).fetch()[0].username;

      Games.insert({
        _id: gameId,
        fen: NEW_GAME_FEN,
        player1: user1Id,
        player2: user2Id,
      });

      Meteor.users.update(user1Id, {$set: {profile: {currentGame: gameId}},
                                    $push: {currentGames: {game: gameId, currentOpponent: user2Username}}});
      Meteor.users.update(user2Id, {$set: {profile: {currentGame: gameId}},
                                    $push: {currentGames: {game: gameId, currentOpponent: user1Username}}});
    },

    sendInvite: function sendInvite(inviteeId, invitedGame, inviterUsername) {
      Meteor.users.update(inviteeId,
                        {$set: {invitedTo: invitedGame,
                                invitedBy: inviterUsername}});
    },
  });
}

// in chess min line 304
// history:function(r){for(var e=[],n=[],t=("undefined"!=typeof r&&"verbose"in r&&r.verbose);vr.length>0;)e.push(m());for(;e.length>0;){var o=e.pop();n.push(t?O(o):v(o)),y(o)}return n}
