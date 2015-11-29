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

  'isChallenged': function isChallenged() {
    return !!Meteor.user().invitedTo;
  },

  'directChallenges': function directChallengesForUser() {
    return DirectChallenges.find({challengeeId: Meteor.userId()});
  },

  'directChallengerUsername': function directChallengerUsername() {
    return this.challengerUsername;
  },
});

Template.challenges.events({
  'click .directChallenge': function acceptDirectChallenge() {
    if (!Meteor.user()) {
      throw new Meteor.Error('login-to-accept-challenge');
    }

    let challengeCreatorId = this.challengerId;
    let challengeAcceptorId = this.challengeeId;

    if (!Meteor.user()) {
      throw new Meteor.Error('login-to-accept-challenge');
    }

    if (Meteor.userId() === challengeCreatorId) {
      throw new Meteor.Error('cannot-accept-own-challenge');
    }

    Meteor.call('gameSetup', challengeCreatorId, challengeAcceptorId);

    DirectChallenges.remove(this._id);
  },

  'click .openChallenge': function acceptOpenChallenge() {
    let challengeCreatorId = this.creatorId;
    let challengeAcceptorId = Meteor.userId();

    if (!Meteor.user()) {
      throw new Meteor.Error('login-to-accept-challenge');
    }

    if (Meteor.userId() === challengeCreatorId) {
      throw new Meteor.Error('cannot-accept-own-challenge');
    }

    Meteor.call('gameSetup', challengeCreatorId, challengeAcceptorId);

    OpenChallenges.remove(this._id);
  },
});

