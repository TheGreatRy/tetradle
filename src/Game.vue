<script setup lang="ts">
import { onUnmounted } from 'vue'
import { getWordOfTheDay, allWords } from './words'
import WordleBoard from './WordleBoard.vue'
import { LetterState, TurnState } from './types'

let currentPlayer: number = $ref(0)
let player0Done = false
let player1Done = false

function onWordleTurnFinished(id: number, state: TurnState) {
    if (state != TurnState.WRONG) (id === 0 ? player0Done = true : player1Done = true);
    if (id === 0) {
        if (!player1Done) currentPlayer = 1;
    }
    else if (!player0Done) currentPlayer = 0;
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
        <WordleBoard @turnFinished="onWordleTurnFinished" :id="0" :current-player="currentPlayer" />
        <WordleBoard @turnFinished="onWordleTurnFinished" :id="1" :current-player="currentPlayer" />
    </div>
</template>

<style scoped>
    header {
        width:500px;
    }
    #gameContainer {
        display: flex;
        column-gap:50px;
    }
</style>
