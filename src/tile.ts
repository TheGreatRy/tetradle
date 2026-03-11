import { LetterState } from './types'

export class Tile
{
    character = ''
    state = LetterState.INITIAL
    constructor(char: string, st: LetterState)
    {
        this.character = char;
        this.state = st;
    }
}