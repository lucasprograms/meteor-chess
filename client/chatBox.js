Template.chatBox.helpers({
  'chatMessages': function getChatMessages() {
    return ChatMessages.find({});
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
    setScrollBarToBottom();
  },

  'click .test-button': function test() {
    debugger
  },
});

Template.chatBox.rendered = function onChatBoxRendered() {
  $('#chat-box').scroll(showMoreVisible);

  // Tracker.autorun(
  //   Tracker.afterFlush(
  //     setScrollBarToBottom
  //   )
  // );
};

function showMoreVisible() {
  let threshold;
  let target = $('#showMoreResults');

  threshold = $('#chat-box').scrollTop() + $('#chat-box').height() - target.height() - $('#chat-box').offset().top;

  if (target.offset().top < threshold) {
    if (!target.data('visible')) {
      target.data('visible', true);
      Session.set('msgsLimit',
            Session.get('msgsLimit') + CHAT_MESSAGES_INCREMENT);
    } else {
      if (target.data('visible')) {
        target.data('visible', false);
      }
    }
  }
}

function setScrollBarToBottom() {
  let chatBox = document.getElementById('chat-box');
  let scrollDistanceToBottom = chatBox.scrollHeight -
                               chatBox.clientHeight;

  chatBox.scrollTop = scrollDistanceToBottom;
}

