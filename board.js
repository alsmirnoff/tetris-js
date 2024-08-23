class Board {
	constructor(ctx) {
		this.ctx = ctx;
		this.piece = null;
	}

	reset() {
	    this.grid = this.getEmptyBoard();
	}

	getEmptyBoard() {
	    return Array.from(
	        {length: ROWS}, () => Array(COLS).fill(0)
	    );
	}

	insideWalls(x) {
		return x >= 0 && x < COLS;
	}

	aboveFloor(y) {
		return y <= ROWS;
	}

	notOccupied(x, y) {
		return this.grid[y] && this.grid[y][x] === 0;
	}

	valid(p) {
		return p.shape.every((row, dy) => {
			return row.every((value, dx) => {
				let x = p.x + dx;
				let y = p.y + dy;
				return value === 0 || 
					(this.insideWalls(x) && this.aboveFloor(y) && this.notOccupied(x, y));
			});
		});
	}

	rotate(piece){
		let p = piece;
		p.shape = JSON.parse(JSON.stringify(piece.shape));

		for (let y = 0; y < p.shape.length; ++y) {
			for (let x = 0; x < y; ++x) {
				[p.shape[x][y], p.shape[y][x]] = 
				[p.shape[y][x], p.shape[x][y]];
			}
		}
		p.shape.forEach((row) => row.reverse());

		return p;
	}

	draw() {
		this.piece.draw();
		this.drawBoard();
	}

	drawBoard() {
		this.grid.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value > 0) {
					this.ctx.fillStyle = COLORS[value];
					this.ctx.fillRect(x + 0.05, y + 0.05, 1-0.1, 1-0.1);
				}
			});
		});
	}

	freeze() {
		this.piece.shape.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value > 0) {
					this.grid[y + this.piece.y][x + this.piece.x] = value;
				}
			});
		});
	}

	drop() {
		let p = moves[KEY.DOWN](this.piece);
		if (this.valid(p)) {
			this.piece.move(p);
		}
		else {
			this.freeze();
			console.table(this.grid);

			this.piece = new Piece(this.ctx);
			this.piece.setStartPosition();
		}
	}
}