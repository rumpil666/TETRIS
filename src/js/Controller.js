export default class Controller {
  constructor(game, view) {
    this._game = game;
    this._view = view;
    this._interval = null;
    this._isPlaying = false;

    document.addEventListener('keydown', this._handleKeyDown.bind(this));
    document.addEventListener('keyup', this._handleKeyUp.bind(this));

    this._view.renderStartScreen();
  }

  _update() {
    this._game.moveFigureDown();
    this._updateView();
  };

  _play() {
    this._isPlaying = true;
    this._startTimer();
    this._updateView();
  }

  _pause() {
    this._isPlaying = false;
    this._stopTimer();
    this._updateView();
  }

  _reset() {
    this._game.reset();
    this._play();
  }

  _updateView() {
    const state = this._game.getState();
    if (state.isGameOver) {
      this._stopTimer();
      this._isPlaying = false;
      this._view.renderGameOverScren(state);
    } else if (!this._isPlaying) {
      this._view.renderPauseScreen();
    } else {
      this._view.renderScreen(state);
    }
  }

  _startTimer() {
    const speed = 1000 - this._game.getState().level * 100;
    if (!this._interval) {
      this._interval = setInterval(() => {
        this._update();
      }, speed > 0 ? speed : 100);
    }
  }

  _stopTimer() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }

  _handleKeyDown(e) {
    switch (e.keyCode) {
      case 13:
        if (this._game.getState().isGameOver) {
          this._reset();
        } else if (this._isPlaying) {
          this._pause();
        } else {
          this._play();
        }
        break;
      case 37:
        if (!this._isPlaying) return;
        this._game.moveFigureLeft();
        this._updateView();
        break;
      case 38:
        if (!this._isPlaying) return;
        this._game.rotateFigure();
        this._updateView();
        break;
      case 39:
        if (!this._isPlaying) return;
        this._game.moveFigureRight();
        this._updateView();
        break;
      case 40:
        if (!this._isPlaying) return;
        this._stopTimer();
        this._game.moveFigureDown();
        this._updateView();
        break;
    }
  }

  _handleKeyUp(e) {
    switch (e.keyCode) {
      case 40:
        if (!this._isPlaying) return;
        this._startTimer();
        break;
    }
  }
}

