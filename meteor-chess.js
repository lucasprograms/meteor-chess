Games = new Mongo.Collection('games');
OpenChallenges = new Mongo.Collection('openChallenges');

NEW_GAME_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

if (Meteor.isClient) {
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_ONLY',
  });
  
  Meteor.subscribe('allUsers');
  Meteor.subscribe('allGames');

  Template.openGames.events({
    'click .joinGame': function joinGame(e) {
      let creatorId = Blaze.getData(e.currentTarget).creatorId;
      let gameId = Blaze.getData(e.currentTarget)._id;

      Meteor.call('createGame', creatorId, Meteor.userId(), gameId);
      OpenGames.remove(gameId);
    },
  });

  Template.social.events({
    'submit .inviteFriendToGame': function inviteFriendToGame(e) {
      e.preventDefault();
      let username = $(e.currentTarget).find('input');
      let user = Meteor.users.findOne({'username': username.val()});

      Meteor.call('updateUserGame', user._id, Meteor.users
            .findOne(Meteor.userId()).profile.currentGame);

      username.val('');
    },
  });

  Template.users.helpers({
    'users': function getUsers() {
      let users = Meteor.users.find().fetch();
      let loggedInUsers = [];

      if (users[0].services) {
        users.forEach( function getLoggedInUsers(user) {
          if (user.services.resume.loginTokens.length > 0) {
            loggedInUsers.push(user);
          }
        });
      }

      return users;
    },
  });  
}


if (Meteor.isServer) {
  Meteor.publish('allUsers', function publishUsers() {
    return Meteor.users.find({});
  });

  Meteor.publish('allGames', function publishGames() {
    return Meteor.games.find({});
  });

  Meteor.methods({
    createChallenge: function createNewChallenge() {

    },

    createNewBoard: function createNewBoard(gameId) {
      Games.insert({
        _id: gameId,
        fen: NEW_GAME_FEN,
        player1: Meteor.userId(),
      });

      Meteor.users.update(Meteor.userId(), {$set: {profile:
                                                  {currentGame: gameId}}});
    },

    createGame: function createGame(user1Id, user2Id) {
      let gameId = new Meteor.Collection.ObjectID();

      Games.insert({
        _id: gameId,
        fen: NEW_GAME_FEN,
        player1: user1Id,
        player2: user2Id,
      });

      Meteor.users.update(user1Id, {$set: {profile: {currentGame: gameId}}});
      Meteor.users.update(user2Id, {$set: {profile: {currentGame: gameId}}});
    },
  });
}

// in chess min line 304
// history:function(r){for(var e=[],n=[],t=("undefined"!=typeof r&&"verbose"in r&&r.verbose);vr.length>0;)e.push(m());for(;e.length>0;){var o=e.pop();n.push(t?O(o):v(o)),y(o)}return n}
