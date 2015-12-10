Template.currentGames.helpers({
  'currentGames': function findUsersCurrentGames() {
    return Meteor.user().currentGames;
  },

  'getCurrentOpponent': function getCurrentOpponent(opp) {
    if (!opp) {
      return 'Custom Board';
    } 

    return opp;
  },

  'currentGamesCount': function currentGamesCount() {
    let user = Meteor.user();

    if (user.currentGames) {
      return user.currentGames.length;
    }
  },
});

Template.currentGames.events({
  'click .switchActiveGame': function switchActiveGame() {
    Meteor.call('switchCurrentGame', this.game);
  },

  'click .remove-item': function removeCurrentGame() {
    Meteor.call('removeCurrentGame', this.game);
  },
})
