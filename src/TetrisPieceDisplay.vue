<script setup lang="ts">
    import { LetterState, Vector2 } from './types'
    import { Tetromino } from './tetrominos'

    defineExpose({ update })

    const board = $ref(
        Array.from({ length: 2 }, () =>
            Array.from({ length: 4 }, () => ({
                letter: '',
                state: LetterState.INITIAL
            }))
        )
    )

    function update(tetromino: Tetromino) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                board[i][j].state = LetterState.INITIAL
            }
        }

        const position = tetromino.getTruePosition()
        for (let i = 0; i < position.length; i++) {
            board[position[i].y][position[i].x].state = tetromino.letterState
        }
    }
</script>

<template>
    <div id="container">
        <div id="board">
            <div v-for="(row, index) in board" class="row">
                <div v-for="(tile, index) in row"
                     :class="['tile', tile.letter && 'filled', (tile.state && tile.state !== 0) && 'revealed']">
                    <div :class="['front']">
                        {{ tile.letter }}
                    </div>
                    <div :class="['back', tile.state]">
                        {{ tile.letter }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    #container {
        aspect-ratio:1/1;
        display:flex;
        align-items:center;
        justify-content:center;
    }
    #board {
        display: grid;
        grid-template-rows: repeat(2, 1fr);
        box-sizing: border-box;
    }
    .row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
    }
    .tile {
        margin: 0.1rem;
        height: 1.5rem;
        aspect-ratio: 1/1;
        font-size: 2rem;
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
        transition: transform 0.3s;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
    }
    .tile .disabled {
        border-color: #e6e6e6 !important;
    }
    .tile.filled .front {
        border-color: #999;
    }
    .tile .back {
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
