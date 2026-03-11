<script setup lang="ts">
import { onUnmounted, defineExpose, ref } from 'vue'
import { getRandomWords, allWords } from './words'
import WordleBoard from './WordleBoard.vue'
import TetrisBoard from './TetrisBoard.vue'
import TetrisPieceDisplay from './TetrisPieceDisplay.vue'
import { LetterState, TurnState } from './types'
import { Tetromino, getRandomTetromino } from './tetrominos'

let currentPlayer: number = $ref(0)
let answers: string[] = $ref(getRandomWords())
let tileData: Tile[] = $ref([])
let player0Done = false
let player1Done = false
let tetrisPhase = false

let score = $ref(0);
let tetrisLevel = $ref(0);
let tetrisLines = $ref(0);

const tetrominoDisplay: TetrisPieceDisplay = ref(null)


function onWordleTurnFinished(id: number, state: TurnState, scoreCost: number) {
    score += scoreCost

    if (state != TurnState.CONTINUE) (id === 0 ? player0Done = true : player1Done = true)
    if (id === 0) {
        if (!player1Done) currentPlayer = 1
    }
    else if (!player0Done) currentPlayer = 0
}

function onTetrisTurnFinished(state: TurnState, scoreAdded: number, level: number, lines: number, upcomingTetromino: Tetromino ) {
    currentPlayer = currentPlayer == 0 ? 1 : 0
    score += scoreAdded
    tetrisLevel = level
    tetrisLines = lines
    tetrominoDisplay.value.update(upcomingTetromino)
}

function setFirstTetromino(firstTetromino: Tetromino) {
    console.log(tetrominoDisplay)
    tetrominoDisplay.value.update(firstTetromino)
}


</script>

<template>
    <header>
        <h1>TETRADLE</h1>
        <a id="source-link"
           href="https://github.com/yyx990803/vue-wordle"
           target="_blank">
            Source
        </a>
    </header>
    <div id="gameContainer">
        <div class="sidebar" id="symmetry my friend" />
        <WordleBoard v-if="!tetrisPhase" @turnFinished="onWordleTurnFinished" :id="0" :active="currentPlayer == 0" :answer="answers[0]" :dataArray="tileData"/>
        <WordleBoard v-if="!tetrisPhase" @turnFinished="onWordleTurnFinished" :id="1" :active="currentPlayer == 1" :answer="answers[1]" :dataArray="tileData"/>
        <TetrisBoard v-if="tetrisPhase" @setFirstTetromino="setFirstTetromino" @turnFinished="onTetrisTurnFinished" :player="currentPlayer" :wordleAnswers="answers"/>
        <div class="sidebar">
            <div class="infoDisplay">
                <b>SCORE:<br />{{score}}</b>
            </div>
            <div class="infoDisplay">
                <b>LEVEL:<br />{{tetrisLevel}}</b>
            </div>
            <div class="infoDisplay">
                <b>LINES:<br />{{tetrisLines}}</b>
            </div>
            <div class="infoDisplay noPadding">
                <TetrisPieceDisplay v-if="tetrisPhase" ref="tetrominoDisplay" />
            </div>
        </div>
    </div>
</template>

<style scoped>
    #gameContainer {
        display: flex;
        column-gap:50px;
        height:100%;
    }
    .sidebar {
        width: 150px;
    }
    .infoDisplay {
        border: 2px solid #d3d6da;
        font-size: 1.3rem;
        padding: 0.5rem;
        margin-top: 2rem;
        border-radius: 5px;
    }
    .noPadding {
        padding: 0px !important;
    }
</style>
