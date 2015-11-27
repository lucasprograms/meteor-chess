Template.deleteButton.events({
  'click .removeItem': function removeItem() {
    OpenChallenges.remove(this._id);
  },
});
