Template.chatBox.helpers({
  'chatMessages': function getChatMessages() {
    return ChatMessages.find({}, {sort: {createdAt: 1}});
  },

  'moreResults': function moreResults() {
    return !(ChatMessages.find().count() < Session.get('msgsLimit'));
  },
});

Template.chatBox.events({
  'submit .chat-input-form': function submitMessage(e) {
    e.preventDefault();

    let message = $('.chat-input').val();
    let user = Meteor.user().username;

    Meteor.call('submitChatMessage', message, user);

    $('.chat-input').val('');

    window.setTimeout(function() {
      setScrollBarToBottom();
    }, 0);
  },
});

Template.chatBox.rendered = function onChatBoxRendered() {
  $('#chat-box').scroll(
    _.throttle(
      showMoreVisible
    , 100)
  );
};

function showMoreVisible() {
  window.setTimeout(function() {
    let chatBox = document.getElementById('chat-box');

    if (chatBox.scrollTop < 10) {
      Session.set('msgsLimit',
            Session.get('msgsLimit') + 2);

      Meteor.subscribe('chatMessages', Session.get('msgsLimit'));

      chatBox.scrollTop = 11;
    }
  }, 0);
}

function setScrollBarToBottom() {
  let chatBox = document.getElementById('chat-box');
  let scrollDistanceToBottom = chatBox.scrollHeight -
                               chatBox.clientHeight;

   chatBox.scrollTop = scrollDistanceToBottom;
}
