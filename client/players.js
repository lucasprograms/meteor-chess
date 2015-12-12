Template.gameStatus.helpers({
  currentPlayer: function getCurrentPlayer() {
    return Meteor.user().username;
  },

  currentOpponent: function getCurrentOpponent() {
    let currentOpp = null;

    Meteor.user().currentGames.forEach( function getCorrectOpponent(game) {
      if (game.game._str === Meteor.user().profile.currentGame._str) {
        currentOpp = game.currentOpponent;
      }
    });

    return currentOpp;
  },
});
