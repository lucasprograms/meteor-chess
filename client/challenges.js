Template.challenges.helpers({
  'openChallenges': function openChallenges() {
    return OpenChallenges.find({});
  },

  'ownChallenge': function isOwnChallenge() {
    return this.creatorId === Meteor.userId();
  },
});

Template.challenges.events({
  'click .openChallenge': function acceptOpenChallenge(e) {
    let challengeCreatorId = Blaze.getData(e.currentTarget).creatorId;
    let challengeAcceptorId = Meteor.userId();

    let num = _.random(1);

    if (num === 1) {
      Meteor.call('createGame', challengeCreatorId, challengeAcceptorId);
    } else {
      
    }
  },
});

