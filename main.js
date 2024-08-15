let board = new Board();

function play() {
    board.reset();
    console.table(board.grid);

    let piece = new Piece(ctx);
    piece.draw();

    board.piece = piece;
}