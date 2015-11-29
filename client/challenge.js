Template.challenge.helpers({
  challenger: function challenger() {
    return Meteor.user().invitedBy;
  },
});

Template.challenge.events({
  'click .directChallenge': function acceptDirectChallenge(e) {
    debugger
  },
});

