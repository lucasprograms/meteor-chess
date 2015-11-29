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

  'submit .inviteToGame': function inviteToGame(e) {
    e.preventDefault();
    let inviteeUsername = $(e.currentTarget).find('input').val();
    let invitee = Meteor.users.find({username: inviteeUsername});
    let inviteeId = invitee.fetch()[0]._id;

    if (!inviteeId) {
      throw new Meteor.Error('no-such-user');
    }

    DirectChallenges.insert({challengerId: Meteor.userId(),
                             challengerUsername: Meteor.user().username,
                             challengeeId: inviteeId});

    $(e.currentTarget).find('input').val('');
  },
});

