export default class Game {
  static points = {
    '1': 100,
    '2': 300,
    '3': 700,
    '4': 1500
  }

  constructor() {
    this.reset();
  }

  get level() {
    return Math.floor(this.lines * 0.1);
  }

  getState() {
    const playField = this._createPlayField();
    const { y: figureY, x: figureX, blocks } = this.activeFigure;

    for (let y = 0; y < this.playField.length; y++) {
      playField[y] = [];

      for (let x = 0; x < this.playField[y].length; x++) {
        playField[y][x] = this.playField[y][x];
      }
    }

    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x]) {
          playField[figureY + y][figureX + x] = blocks[y][x];
        }
      }
    }

    return {
      score: this.score,
      level: this.level,
      lines: this.lines,
      nextFigure: this.nextFigure,
      playField,
      isGameOver: this._topOut
    }
  }

  reset() {
    this.score = 0;
    this.lines = 0;
    this._topOut = false;
    this.playField = this._createPlayField();
    this.activeFigure = this._createFigure();
    this.nextFigure = this._createFigure();
  }

  _createPlayField() {
    const playField = [];

    for (let y = 0; y < 20; y++) {
      playField[y] = [];

      for (let x = 0; x < 10; x++) {
        playField[y][x] = 0;
      }
    }

    return playField;
  }

  _createFigure() {
    const index = Math.floor(Math.random() * 7)
    const type = 'IJLOSTZ'[index];
    const piece = {  };

    switch (type) {
      case 'I':
        piece.blocks = [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
        break;
      case 'J':
        piece.blocks = [
          [0, 0, 0],
          [1, 1, 1],
          [0, 0, 1]
        ];
        break;
      case 'L':
        piece.blocks = [
          [0, 0, 0],
          [1, 1, 1],
          [1, 0, 0]
        ];
        break;
      case 'O':
        piece.blocks = [
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0]
        ];
        break;
      case 'S':
        piece.blocks = [
          [0, 0, 0],
          [0, 1, 1],
          [1, 1, 0]
        ];
        break;
      case 'T':
        piece.blocks = [
          [0, 0, 0],
          [1, 1, 1],
          [0, 1, 0]
        ];
        break;
      case 'Z':
        piece.blocks = [
          [0, 0, 0],
          [1, 1, 0],
          [0, 1, 1]
        ];
        break;
      default:
        throw new Error('Неизвестная фигура')
    }
    piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
    piece.y = -1;
    return piece;
  }

  rotateFigure() {
    const blocks = this.activeFigure.blocks;
    const length = blocks.length;
    const temp = [];

    for (let i = 0; i < length; i++) {
      temp[i] = new Array(length).fill(0);
    }

    for (let y = 0; y < length; y++) {
      for (let x = 0; x < length; x++) {
        temp[x][y] = blocks[length - 1 - y][x];
      }
    }

    this.activeFigure.blocks = temp;

    if (this._checkCollision()) {
      this.activeFigure.blocks = blocks;
    }
  }

  moveFigureLeft() {
    this.activeFigure.x -= 1;

    if (this._checkCollision()) {
      this.activeFigure.x += 1;
    }
  }

  moveFigureRight() {
    this.activeFigure.x += 1;

    if (this._checkCollision()) {
      this.activeFigure.x -= 1;
    }
  }

  moveFigureDown() {
    if (this._topOut) return;
    this.activeFigure.y += 1;

    if (this._checkCollision()) {
      this.activeFigure.y -= 1;
      this._lockFigure();
      this._updateFigure();
      const clearedLines = this._clearLines();
      this._updateScore(clearedLines)
    }

    if (this._checkCollision()) {
      this._topOut = true;
    }
  }

  _checkCollision() {
    const { y: figureY, x: figureX, blocks } = this.activeFigure;

    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (
          blocks[y][x] &&
          (this.playField[figureY + y] === undefined ||
            this.playField[figureY + y][figureX + x] === undefined || this.playField[figureY + y][figureX + x] === 1)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  _lockFigure() {
    const { y: figureY, x: figureX, blocks } = this.activeFigure;
    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x]) {
          this.playField[figureY + y][figureX + x] = blocks[y][x];
        }
      }
    }
  }

  _updateFigure() {
    this.activeFigure = this.nextFigure;
    this.nextFigure = this._createFigure();
  }

  _updateScore(clearedLines) {
    if (clearedLines > 0) {
      this.score += Game.points[clearedLines] * (this.level + 1);
      this.lines += clearedLines;
    }
  }

  _clearLines() {
    const rows = 20;
    const columns = 10;
    let lines = [];

    for (let y = rows - 1; y >= 0; y--) {
      let quantityBlocks = 0;
      for(let x = 0; x < columns; x++) {
        if(this.playField[y][x]) {
          quantityBlocks += 1;
        }
      }

      if (quantityBlocks === 0) {
        break;
      } else if (quantityBlocks < columns) {
        continue;
      } else {
        lines.unshift(y);
      }
    }

    for (let index of lines) {
      this.playField.splice(index, 1);
      this.playField.unshift(new Array(columns).fill(0))
    }

    return lines.length;
  }
}
