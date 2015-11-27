Template.gameControlButtons.events({
  'click .createNewBoard': function createNewBoard() {
    let newGameId = new Meteor.Collection.ObjectID();

    Meteor.call('createNewBoard', newGameId);
  },

  'click .createNewChallenge': function createNewChallenge() {
    let newGameId = new Meteor.Collection.ObjectID();

    OpenChallenges.insert({_id: newGameId, creatorId: Meteor.userId(),
                  username: Meteor.user().username, createdAt: new Date()});
  },
});

