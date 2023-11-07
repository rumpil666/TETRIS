export default class View {
  constructor(element, width, height, rows, columns) {
    this._element = element;
    this._width = width;
    this._height = height;

    this._canvas = document.createElement('canvas');
    this._canvas.width = this._width;
    this._canvas.height = this._height;
    this._context = this._canvas.getContext('2d')

    this._playFieldBorderWidth = 4;
    this._playFieldX = this._playFieldBorderWidth;
    this._playFieldY = this._playFieldBorderWidth;
    this._playFieldWidth = this._width * 2 / 3;
    this._playField_Height = this._height;
    this._playFieldInnerWidth = this._playFieldWidth - this._playFieldBorderWidth * 2;
    this._playFieldInner_Height = this._playField_Height - this._playFieldBorderWidth * 2;

    this._blockWidth = this._playFieldInnerWidth / columns;
    this._block_Height = this._playFieldInner_Height / rows;

    this._panelX = this._playFieldWidth + 10;
    this._panelY = 0;

    this._element.appendChild(this._canvas);
  }

  renderScreen(state) {
    this._clearField();
    this._renderPlayField(state);
    this._renderPanel(state);
  }

  renderStartScreen() {
    this._context.fillStyle = 'white';
    this._context.font = '24px "Segoe UI"';
    this._context.textAlign = 'center';
    this._context.textBaseline = 'middle';
    this._context.fillText('Press Enter to Start', this._width / 2, this._height / 2);
  }

  renderPauseScreen() {
    this._context.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this._context.fillRect(0, 0, this._width, this._height);

    this._context.fillStyle = 'white';
    this._context.font = '24px "Segoe UI"';
    this._context.textAlign = 'center';
    this._context.textBaseline = 'middle';
    this._context.fillText('Press Enter to Resume', this._width / 2, this._height / 2);
  }

  renderGameOverScren({ score }) {
    this._context.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this._context.fillRect(0, 0, this._width, this._height);

    this._context.fillStyle = 'white';
    this._context.font = '24px "Segoe UI"';
    this._context.textAlign = 'center';
    this._context.textBaseline = 'middle';
    this._context.fillText('GAME OVER', this._width / 2, this._height / 2 - 48);
    this._context.fillText(`Score: ${score}`, this._width / 2, this._height / 2);
    this._context.fillText('Press Enter to Restart', this._width / 2, this._height / 2 + 48);
  }

  _clearField() {
    this._context.clearRect(0, 0, this._width, this._height);
  }

  _renderPlayField({ playField }) {
    for (let y = 0; y < playField.length; y++) {
      const line = playField[y];

      for (let x = 0; x < line.length; x++) {
        const block = line[x];

        if (block) {
          this._renderBlock(
            this._playFieldX + (x * this._blockWidth),
            this._playFieldY + (y * this._block_Height),
            this._blockWidth,
            this._block_Height,
            'red'
          );
        }
      }
    }
    this._context.strokeStyle = 'white';
    this._context.lineWidth = this._playFieldBorderWidth;
    this._context.strokeRect(0, 0, this._playFieldWidth, this._playField_Height)
  }

  _renderPanel({ level, score, lines, nextFigure }) {
    this._context.textAlign = 'start';
    this._context.textBaseline = 'top';
    this._context.fillStyle = 'white',
    this._context.font = '14px "Segoe UI"';

    this._context.fillText(`Level: ${level}`, this._panelX, this._panelY + 10);
    this._context.fillText(`Score: ${score}`, this._panelX, this._panelY + 34);
    this._context.fillText(`Lines: ${lines}`, this._panelX, this._panelY + 58);
    this._context.fillText(`Next:`, this._panelX, this._panelY + 106);

    for (let y = 0; y < nextFigure.blocks.length; y++) {
      for (let x = 0; x < nextFigure.blocks[y].length; x++) {
        const block = nextFigure.blocks[y][x];

        if (block) {
          this._renderBlock(
            this._panelX + (x * this._blockWidth / 2),
            this._panelY + 105 + (y * this._block_Height / 2),
            this._blockWidth / 2,
            this._block_Height / 2,
            'red'
          )
        }
      }
    }
  }

  _renderBlock(x, y, _width, _height, color) {
    this._context.fillStyle = color;
    this._context.strokeStyle = 'black';
    this._context.lineWidth = 2;
    this._context.fillRect(x, y, _width, _height)
    this._context.strokeRect(x, y, _width, _height)
  }
}
