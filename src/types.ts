export const enum LetterState {
    INITIAL = 0,
    CORRECT = 'correct',
    PRESENT = 'present',
    ABSENT = 'absent',
    TETROMINO_I = 'tetrominoI',
    TETROMINO_J = 'tetrominoJ',
    TETROMINO_L = 'tetrominoL',
    TETROMINO_O = 'tetrominoO',
    TETROMINO_S = 'tetrominoS',
    TETROMINO_T = 'tetrominoT',
    TETROMINO_Z = 'tetrominoZ'
}

export const enum GameState {
    WORDLE = 'wordle',
    TETRIS = 'tetris',
    END = 'end'
}

export const enum TurnState {
    WIN = 'win',
    CONTINUE = 'continue',
    LOSS = 'loss'
}

export class Vector2 {
    constructor(x: number, y:number) {
        this.x = x;
        this.y = y;
    }

    static add(a: Vector2, b:Vector2) {
        return new Vector2(a.x + b.x, a.y + b.y)
    }

    x: number = 0
    y: number = 0
}