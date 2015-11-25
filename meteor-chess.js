Games = new Mongo.Collection('games');

NEW_GAME_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

if (Meteor.isClient) {
  Meteor.subscribe('allUsers');
  Meteor.subscribe('allGames');

  Template.game.helpers({
    'userHasGame': function userHasGame() {
      return !!Meteor.user().profile.currentGame;
    },

    'currentGame': function getCurrentGame() {
      currentGame = Games.findOne(Meteor.users.findOne(Meteor.userId())
                                              .profile.currentGame);

      game = new Chess(currentGame.fen);

      if (currentGame) {
        let cfg = {
          draggable: true,
          position: currentGame.fen,
          onDragStart: onDragStart,
          onDrop: onDrop,
          onSnapEnd: onSnapEnd,
        };

        statusEl = $('#status');
        board = ChessBoard('board', cfg);

        updateStatus();
      }
    },
  });

  Template.game.events({
    'click .newGame': function newGame() {
      newGameId = new Meteor.Collection.ObjectID();

      Meteor.call('newGame', newGameId);
      Meteor.call('updateUserGame', Meteor.userId(), newGameId);
    },
  });

  Template.social.events({
    'submit .inviteFriendToGame': function inviteFriendToGame(e) {
      e.preventDefault();
      let email = $(e.currentTarget).find('input');
      let user = Meteor.users.findOne({'emails.address': email.val()});

      Meteor.call('updateUserGame', user._id, Meteor.users
            .findOne(Meteor.userId()).profile.currentGame);

      email.val('');
    },
  });
}

Meteor.methods({
  newGame: function newGame(newGameId) {
    Games.insert({
      _id: newGameId,
      fen: NEW_GAME_FEN,
      player1: Meteor.userId(),
    });
  },

  updateUserGame: function updateUserGame(userId, gameId) {
    Meteor.users.update(userId, {$set: {profile: {currentGame: gameId}}});
  },
});


if (Meteor.isServer) {
  Meteor.publish('allUsers', function publishUsers() {
    return Meteor.users.find({});
  });

  Meteor.publish('allGames', function publishGames() {
    return Meteor.games.find({});
  });
}

// in chess min line 304
// history:function(r){for(var e=[],n=[],t=("undefined"!=typeof r&&"verbose"in r&&r.verbose);vr.length>0;)e.push(m());for(;e.length>0;){var o=e.pop();n.push(t?O(o):v(o)),y(o)}return n}
