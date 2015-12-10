Template.currentOpponent.helpers({
  currentOpponent: function getCurrentOpponent() {                  
    if (currentOpponent) {
      return currentOpponent.username;
    }
  },
});

Template.currentPlayer.helpers({
  currentPlayer: function getCurrentPlayer() {
    return Meteor.user().username;
  },
});
