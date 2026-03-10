import { LetterState, Vector2 } from "./types"

export function getRandomTetromino()
{
    const keys = Object.keys(tetrominoStates)

    var rand = Math.floor(Math.random() * (keys.length))
    return new Tetromino(keys[rand])
}

export class Tetromino {
    constructor(type: string) {
        this.rotationStates = tetrominoStates[type]
        this.letterState = Object.values(LetterState)[Object.values(LetterState).indexOf(type)] as LetterState
    }

    getPosIfRotated() {
        const rotationIndex = this.currentRotationState + 1 < this.rotationStates.length ? this.currentRotationState + 1 : 0
        const rotationState = this.rotationStates[rotationIndex]
        return this.getTruePosition(rotationState)
    }

    getPosIfMoved(movement: Vector2) {
        return this.getTruePosition(this.rotationStates[this.currentRotationState], Vector2.add(movement, this.currentPos))
    }

    rotate() {
        this.currentRotationState++
        if (this.currentRotationState >= this.rotationStates.length) this.currentRotationState = 0
    }

    move(movement: Vector2) {
        this.currentPos = Vector2.add(this.currentPos, movement)
    }

    getTruePosition(state: Vector2[] = this.rotationStates[this.currentRotationState], globalPos: Vector2 = this.currentPos) {
        const posArray = []
        for (let i = 0; i < state.length; i++) {
            posArray.push(Vector2.add(state[i], globalPos))
        }
        return posArray
    }

    currentRotationState: number = 0
    currentPos: Vector2 = new Vector2(1, -1) // (4, -18) starting pos for tetris board, instantiates at (1, -1) for the next piece display
    rotationStates: Vector2[][]
    letterState: LetterState
}

const tetrominoStates: Record<string, Vector2[][]> = {
    tetrominoI: [
        [ new Vector2(-1, 0), new Vector2(0, 0), new Vector2(1, 0), new Vector2(2, 0) ],
        [ new Vector2(0, -2), new Vector2(0, -1), new Vector2(0, 0), new Vector2(0, 1) ]
    ],
    tetrominoJ: [
        [ new Vector2(-1, 0), new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1) ],
        [ new Vector2(0, -1), new Vector2(1, -1), new Vector2(0, 0), new Vector2(0, 1) ],
        [ new Vector2(-1, -1), new Vector2(-1, 0), new Vector2(0, 0), new Vector2(1, 0) ],
        [ new Vector2(0, -1), new Vector2(0, 0), new Vector2(-1, 1), new Vector2(0, 1) ]
    ],
    tetrominoL: [
        [new Vector2(-1, 0), new Vector2(0, 0), new Vector2(1, 0), new Vector2(-1, 1)],
        [new Vector2(0, -1), new Vector2(0, 0), new Vector2(0, 1), new Vector2(1, 1)],
        [new Vector2(1, -1), new Vector2(-1, 0), new Vector2(0, 0), new Vector2(1, 0)],
        [new Vector2(-1, -1), new Vector2(0, -1), new Vector2(0, 0), new Vector2(0, 1)]
    ],
    tetrominoO: [
        [ new Vector2(0, 0), new Vector2(1, 0), new Vector2(0, 1), new Vector2(1, 1) ]
    ],
    tetrominoS: [
        [new Vector2(0, 0), new Vector2(1, 0), new Vector2(-1, 1), new Vector2(0, 1)],
        [new Vector2(-1, -1), new Vector2(-1, 0), new Vector2(0, 0), new Vector2(0, 1)]
    ],
    tetrominoT: [
        [new Vector2(-1, 0), new Vector2(0, 0), new Vector2(1, 0), new Vector2(0, 1)],
        [new Vector2(0, -1), new Vector2(0, 0), new Vector2(1, 0), new Vector2(0, 1)],
        [new Vector2(0, -1), new Vector2(-1, 0), new Vector2(0, 0), new Vector2(1, 0)],
        [new Vector2(0, -1), new Vector2(-1, 0), new Vector2(0, 0), new Vector2(0, 1)]
    ],
    tetrominoZ: [
        [new Vector2(-1, 0), new Vector2(0, 0), new Vector2(0, 1), new Vector2(1, 1)],
        [new Vector2(0, -1), new Vector2(-1, 0), new Vector2(0, 0), new Vector2(-1, 1)]
    ]
}