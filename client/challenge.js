Template.challenge.helpers({
  challenger: function challenger() {
    return Meteor.user().invitedBy;
  },
});


