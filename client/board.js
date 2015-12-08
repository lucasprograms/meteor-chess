Template.board.helpers({
  'currentGame': function getCurrentGame() {
    let orientation;

    if (Meteor.user()) {
      currentGame = Games.findOne(Meteor.user().profile.currentGame);
    } else {
      currentGame = Games.insert({
        fen: NEW_GAME_FEN,
        player1: Meteor.userId(),
      });
    }

    game = new Chess(currentGame.fen);

    if (Meteor.userId() === currentGame.player1) {
      orientation = 'white';
    } else {
      orientation = 'black';
    }

    if (currentGame) {
      let cfg = {
        draggable: true,
        position: currentGame.fen,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        orientation: orientation,
      };

      statusEl = $('#status');

      //no attempt at board marking before there's a DOM!
      //could go in an onrendered function?
      if ($('#board').length !== 0) {
        board = ChessBoard('board', cfg);
        
        $(window).resize(board.resize);
      }

      updateStatus();
    }
  },
});
