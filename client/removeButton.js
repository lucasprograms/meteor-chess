Template.deleteButton.events({
  'click .removeItem': function removeItem() {
    // VALIDATOR!!!!

    OpenChallenges.remove(this._id);
  },
});
