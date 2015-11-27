Template.challenges.helpers({
  'openChallenges': function openChallenges() {
    return OpenChallenges.find({});
  },

  'ownChallenge': function isOwnChallenge() {
    return this.creatorId === Meteor.userId();
  },

  'openChallengeCount': function openChallengeCount() {
    return OpenChallenges.find({}).count();
  },
});

Template.challenges.events({
  'click .openChallenge': function acceptOpenChallenge(e) {
    if (!Meteor.user()) {
      throw new Meteor.Error('login-to-accept-challenge');
    }

    let challenge = Blaze.getData(e.currentTarget);
    let challengeCreatorId = challenge.creatorId;

    if (Meteor.userId() === challengeCreatorId) {
      throw new Meteor.Error('cannot-accept-own-challenge');
    }

    let challengeAcceptorId = Meteor.userId();

    let num = _.random(1);

    if (num === 1) {
      // challenge creator plays white
      Meteor.call('createGame', challengeCreatorId, challengeAcceptorId);
    } else {
      // challenge creator plays black
      Meteor.call('createGame', challengeAcceptorId, challengeCreatorId);
    }

    OpenChallenges.remove(challenge._id);
  },
});

