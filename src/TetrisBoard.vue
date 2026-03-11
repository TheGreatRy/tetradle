<script setup lang="ts">
    import { onUnmounted, onMounted } from 'vue'
    import { allWords, letters } from './words'
    import { LetterState, TurnState, Vector2 } from './types'
    import { getRandomTetromino, Tetromino } from './tetrominos'
    import {Tile } from './tile'

    defineExpose({initializeBoard})

    const props = defineProps<{
        player: number,
        wordleAnswers: string[],
        dataArray: Tile[]
    }>()

    const emit = defineEmits<{
        (e: 'turnFinished', state: TurnState, scoreAdded: number, level: number, lines: number, upcomingTetromino: Tetromino): void,
        (e: 'setFirstTetromino', firstTetromino: Tetromino): void
    }>()


    // Handle keyboard input.
    let allowInput = true

    // Level values
    let level = 0
    let lines = 0

    let turnPoints = 0

    let turnDelay = 0

    let lost = false

    let currentTetromino: Tetromino = new getRandomTetromino()
    currentTetromino.currentPos = new Vector2(4, 0)
    let upcomingTetromino: Tetromino = new getRandomTetromino()

    // Board state. Each tile is represented as { letter, state }
    const board = $ref(
        Array.from({ length: 20 }, () =>
            Array.from({ length: 10 }, () =>
                new Tile('', LetterState.INITIAL)
            )
        )
    )

    const onKeyup = (e: KeyboardEvent) => onKey(e)

    window.addEventListener('keyup', onKeyup)

    onUnmounted(() => {
        window.removeEventListener('keyup', onKeyup)
    })

    onMounted(() => {
        emit('setFirstTetromino', upcomingTetromino)
        initializeBoard()
        tick()
    })

    function initializeBoard()
    {
        //row amount
        let r = (props.dataArray.length / 10)

        //last row up
        let j = 19 - r + 1 //18 + 1

        //iter from 19 -> j

        console.log(props.dataArray)
        for (let i = 0; i < props.dataArray.length; i++) {
            if (i != 0 && i % 10 == 0) r--
            board[j][i % 10] = props.dataArray[i]
            console.log(board[j][i % 10])
        }
    }

    function onKey(e: KeyboardEvent) {
        const key = e.key
        if (!allowInput) return
        if (props.player == 0) {
            if (key === 'w' || key === 'W') rotate()
            else if (key === 'a' || key === 'A') moveX(false)
            else if (key === 'd' || key === 'D') moveX(true)
            else if (key === 's' || key === 'S') e.shiftKey ? softDrop() : hardDrop()
        }
        else {
            if (key === 'ArrowUp') rotate()
            else if (key === 'ArrowLeft') moveX(false)
            else if (key === 'ArrowRight') moveX(true)
            else if (key === 'ArrowDown') e.shiftKey ? softDrop() : hardDrop()
        }
    }

    function tick() {
        if (allowInput) dropOne()
        setTimeout(() => {
            if (!lost) tick()
        }, turnDelay + getTickTime())
    }

    function moveX(moveRight: boolean) {
        const vector = new Vector2(moveRight ? 1 : -1, 0)
        const currentPos = currentTetromino.getTruePosition()
        const resultingPos = currentTetromino.getPosIfMoved(vector)
        let canMove = true
        draw(currentPos)
        for (let i = 0; i < resultingPos.length; i++) {
            if (resultingPos[i].x < 0 || resultingPos[i].x >= 10 || (resultingPos[i].y >= 0 && board[resultingPos[i].y][resultingPos[i].x].state !== LetterState.INITIAL)) {
                canMove = false
                break
            }
        }
        if (canMove) eraseLetters(currentPos)
        draw(canMove ? resultingPos : currentPos, currentTetromino.letterState)
        if (canMove) currentTetromino.move(vector)
    }

    function rotate() {
        const currentPos = currentTetromino.getTruePosition()
        const resultingPos = currentTetromino.getPosIfRotated()
        let canRotate = true
        draw(currentPos)
        for (let i = 0; i < resultingPos.length; i++) {
            if (resultingPos[i].x < 0 || resultingPos[i].x >= 10 || resultingPos[i].y >= 20 || (resultingPos[i].y >= 0 && board[resultingPos[i].y][resultingPos[i].x].state !== LetterState.INITIAL)) {
                canRotate = false
                break
            }
        }
        if (canRotate) eraseLetters(currentPos)
        draw(canRotate ? resultingPos : currentPos, currentTetromino.letterState)
        if (canRotate) currentTetromino.rotate()
    }

    function dropOne() {
        const vector = new Vector2(0, 1)
        const currentPos = currentTetromino.getTruePosition()
        const resultingPos = currentTetromino.getPosIfMoved(vector)
        let canDrop = true
        draw(currentPos)
        for (let i = 0; i < resultingPos.length; i++) {
            if (resultingPos[i].y >= 20 || (resultingPos[i].y >= 0 && board[resultingPos[i].y][resultingPos[i].x].state !== LetterState.INITIAL)) {
                canDrop = false
                break
            }
        }
        if (canDrop) eraseLetters(currentPos)
        draw(canDrop ? resultingPos : currentPos, currentTetromino.letterState)

        if (canDrop) {
            currentTetromino.move(vector)
            return true
        }
        else {
            endTurn()
            return false
        }
    }

    function endTurn() {
        clearLines()

        setTimeout(() => {
            turnDelay = 0
            currentTetromino = upcomingTetromino
            currentTetromino.currentPos = new Vector2(4, 0)
            upcomingTetromino = getRandomTetromino()
            const truePos = currentTetromino.getTruePosition()

            for (let i = 0; i < truePos.length; i++) {
                if (truePos[i].y >= 0 && board[truePos[i].y][truePos[i].x].state !== LetterState.INITIAL) {
                    lost = true
                    break
                }
            }

            draw(truePos, currentTetromino.letterState)

            emit('turnFinished', lost ? TurnState.LOSS : TurnState.CONTINUE, turnPoints, level, lines, upcomingTetromino)
            turnPoints = 0
            allowInput = !lost
        }, turnDelay * 0.9)
    }

    function clearLines() {
        allowInput = false
        let minY = 100
        let maxY = -100
        const currentPos = currentTetromino.getTruePosition()

        for (let i = 0; i < currentPos.length; i++) {
            if (currentPos[i].y < minY) minY = currentPos[i].y
            if (currentPos[i].y > maxY) maxY = currentPos[i].y
        }

        let linesCleared: number[] = []
        for (let i = minY; i < maxY + 1; i++) {
            let lineCleared = true
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j].state === LetterState.INITIAL) {
                    lineCleared = false
                    break
                }
            }

            if (lineCleared) linesCleared.push(i)
        }

        if (linesCleared.length === 0) return

        turnDelay = 1000
        switch (linesCleared.length) {
            case 1:
                turnPoints += (40 * (level + 1))
                break
            case 2:
                turnPoints += (100 * (level + 1))
                break
            case 3:
                turnPoints += (300 * (level + 1))
                break
            case 4:
                turnPoints += (1200 * (level + 1))
                break
        }

        if ((lines % 10) + linesCleared.length >= 10) level++
        lines += linesCleared.length

        for (let i = linesCleared.length - 1; i >= 0; i--) {
            for (let j = 0; j < board[i].length; j++) {
                board[linesCleared[i]][j].state = LetterState.INITIAL
                board[linesCleared[i]][j].character = ""
            }
        }

        setTimeout(() => {
            for (let i = 0; i < linesCleared.length; i++) {
                for (let j = linesCleared[i]; j >= 1; j--) {
                    for (let k = 0; k < board[j].length; k++) {
                        board[j][k].state = board[j - 1][k].state
                        board[j][k].character = board[j - 1][k].character
                    }
                }
            }
            for (let j = 0; j < board[0].length; j++) {
                board[0][j].state = LetterState.INITIAL
                board[0][j].character = ""
            }
        }, turnDelay * 0.8)
    }

    function hardDrop() {
        while (true) {
            if (dropOne()) turnPoints++
            else break
        }
    }

    function softDrop() {
        if (dropOne()) turnPoints++
    }

    function eraseLetters(pos: Vector2[]) {
        for (let i = 0; i < pos.length; i++) {
            if (pos[i].y >= 0) board[pos[i].y][pos[i].x].character = ""
        }
    }

    function draw(pos: Vector2[], letterState: LetterState = LetterState.INITIAL) {
        for (let i = 0; i < pos.length; i++) {
            if (pos[i].y >= 0) {
                board[pos[i].y][pos[i].x].state = letterState
                if (letterState !== LetterState.INITIAL && board[pos[i].y][pos[i].x].character == "") {
                    const sourceString = (pos[i].x > 4) ? props.wordleAnswers[1] : props.wordleAnswers[0]
                    switch (letterState) {
                        case LetterState.CORRECT:
                        case LetterState.TETROMINO_I:
                        case LetterState.TETROMINO_J:
                            board[pos[i].y][pos[i].x].character = sourceString[pos[i].x % 5]
                            break
                        case LetterState.PRESENT:
                        case LetterState.TETROMINO_S:
                        case LetterState.TETROMINO_T:
                            const letterAtPlace = sourceString[pos[i].x % 5]
                            const operatingString = sourceString.replaceAll(letterAtPlace, "")
                            board[pos[i].y][pos[i].x].character = operatingString[Math.floor(Math.random() * (operatingString.length))]
                            break
                        default:
                            let absentLetters = letters
                            for (let i = 0; i < sourceString.length; i++) {
                                absentLetters = absentLetters.filter((l) => l != sourceString[i])
                            }
                            board[pos[i].y][pos[i].x].character = absentLetters[Math.floor(Math.random() * (absentLetters.length))]
                    }
                }
            }
        }
    }

    function getTickTime() {
        if (level < 9) return 800 - (level * 83.33)
        else if (level === 9) return 100  
        else if (level < 13) return 83.33
        else if (level < 16) return 66.66
        else if (level < 19) return 50
        else if (level < 29) return 33.33
        else return 16.66
    }

</script>

<template>
    <div>
        <div id="board">
            <div v-for="(row, index) in board" class="row">
                <div v-for="(tile, index) in row"
                    :class="['tile', tile.character && 'filled', (tile.state && tile.state !== 0) && 'revealed']"
                >
                    <div :class="['front']">
                        {{ tile.character }}
                    </div>
                    <div :class="['back', tile.state + ((tile.state === 'correct' || tile.state === 'present' || tile.state === 'absent') ? '-tetris' : '')]"
                    >
                        {{ tile.character }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    #board {
        display: grid;
        grid-template-rows: repeat(20, 1fr);
        padding: 10px;
        box-sizing: border-box;
        height: 90%;
        margin: 0px auto;
    }
    .row {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
    }
    .tile {
        margin: 0.1rem;
        height: 2rem;
        aspect-ratio: 1/1;
        font-size: 1.5rem;
        line-height: 2rem;
        font-weight: bold;
        vertical-align: middle;
        text-transform: uppercase;
        user-select: none;
        position: relative;
    }
    .tile.filled {
        animation: zoom 0.2s;
    }
    .tile .front, 
    .tile .back {
        box-sizing: border-box;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
    }
    .tile .front {
        border: 2px solid #d3d6da;
    }
    .tile .disabled {
        border-color: #e6e6e6 !important;
    }
    .tile.filled .front {
        border-color: #999;
    }
    .tile .back {
        transition: transform 0.1s;
        transform: rotateX(180deg);
    }
    .tile.revealed .front {
        transform: rotateX(180deg);
    }
    .tile.revealed .back {
        transform: rotateX(0deg);
    }
    @media (max-height: 680px) {
        .tile {
            font-size: 3vh;
        }
    }
</style>
