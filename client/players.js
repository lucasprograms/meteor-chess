Template.currentOpponent.helpers({
  currentOpponent: function getCurrentOpponent() {
    let currentOpponent = Meteor.users.find(Meteor.user().profile.currentOpponent).
                  fetch()[0];
                  
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
