<script setup lang="ts">
    import { LetterState, Vector2 } from './types'
    import { Tetromino } from './tetrominos'

    const board = $ref(
        Array.from({ length: 4 }, () =>
            Array.from({ length: 4 }, () => ({
                letter: '',
                state: LetterState.INITIAL
            }))
        )
    )

    function update(tetromino: Tetromino) {
        board = Array.from({ length: 4 }, () =>
            Array.from({ length: 4 }, () => ({
                letter: '',
                state: LetterState.INITIAL
            }))
        )

        const position = tetromino.getTruePosition()
        for (let i = 0; i < position.length; i++) {
            board[position[i].x][position[i].y] = tetromino.letterState
        }
    }
</script>

<template>
    <div>
        <div id="board">
            <div v-for="(row, index) in board" class="row">
                <div v-for="(tile, index) in row"
                     :class="['tile', (tile.state && tile.state !== 0) && 'revealed']">
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
    #board {
        display: grid;
        grid-template-rows: repeat(4, 1fr);
        padding: 10px;
        box-sizing: border-box;
        height: 120px;
        margin: 0px auto;
    }
    .row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
    }
    .tile {
        margin: 0.1rem;
        height: 2rem;
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
