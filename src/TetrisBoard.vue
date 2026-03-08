<script setup lang="ts">
import { onUnmounted } from 'vue'
import { LetterState, TurnState } from './types'

const props = defineProps<{
    player: number
}>()

const emit = defineEmits<{
    (e: 'turnFinished', state: TurnState, scoreAdded: number): void
}>()


// Handle keyboard input.
let allowInput = true

// Level values
let level = 0
let linesCleared = 0

// Board state. Each tile is represented as { letter, state }
const board = $ref(
    Array.from({ length: 20 }, () =>
        Array.from({ length: 10 }, () => ({
            letter: '',
            state: LetterState.INITIAL
        }))
    )
)

const onKeyup = (e: KeyboardEvent) => onKey(e.key)

window.addEventListener('keyup', onKeyup)

onUnmounted(() => {
    window.removeEventListener('keyup', onKeyup)
})

function onKey(key: string) {
    if (!props.active || !allowInput) return
    /*if (/^[a-zA-Z]$/.test(key)) {
        fillTile(key.toLowerCase())
    } else if (key === 'Backspace') {
        clearTile()
    } else if (key === 'Enter') {
        completeRow()
    }*/
}

function completeRow() {
}

</script>

<template>
    <div>
        <div id="board">
            <div v-for="(row, index) in board" class="row">
                <div v-for="(tile, index) in row"
                    :class="['tile', tile.letter && 'filled', tile.state && 'revealed']"
                >
                    <div :class="['front']" :style="{ transitionDelay: `${index * 300}ms` }">
                        {{ tile.letter }}
                    </div>
                    <div :class="['back', tile.state]"
                        :style="{
                            transitionDelay: `${index * 300}ms`,
                            animationDelay: `${index * 100}ms`
                        }"
                    >
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
    transition: transform 0.6s;
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
