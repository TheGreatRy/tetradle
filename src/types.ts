export const enum LetterState {
    INITIAL = 0,
    CORRECT = 'correct',
    PRESENT = 'present',
    ABSENT = 'absent'
}

export const enum GameState {
    WORDLE = 'wordle',
    TETRIS = 'tetris',
    END = 'end'
}

export const enum TurnState {
    CORRECT = 'correct',
    WRONG = 'wrong',
    LOSS = 'loss'
}