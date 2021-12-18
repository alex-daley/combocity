import Square, { Zone } from './square'

export const numCols = 5
export const numRows = numCols
export const numSquares = numCols * numRows

export function createBoard() {
  return new Array<Square>(numSquares).fill(new Square())
}

export function createAndPopulateBoard() {
  const rand = (board: Square[]): number => {
    const i = Math.floor(Math.random() * numSquares)
    return board[i].zone ? rand(board) : i
  }

  const board = createBoard()
  for (let i = 0; i < 4; i++) board[rand(board)] = new Square('residential', 2)
  board[rand(board)] = new Square('commercial', 2)
  board[rand(board)] = new Square('industrial', 2)

  return board
}

export function getSquaresByZone(board: Square[], zone: Zone) {
  return board.filter(square => square.zone === zone)
}

export function sumScores(board: Square[]) {
  return board.reduce((sum, square) => square.value + sum, 0)
}

export function sumScoresOfZone(board: Square[], zone: Zone) {
  return sumScores(getSquaresByZone(board, zone))
}

export function moveLeft(board: Square[]) {
  return moveBoard(board, i => (i % numCols) === 0 ? i : i - 1)
}

export function moveUp(board: Square[]) {
  return moveBoard(board, i => i - numRows < 0 ? i : i - numRows)
}

export function moveRight(board: Square[]) {
  return moveBoard(board, i => (i % numCols) === numCols - 1 ? i : i + 1, true)
}

export function moveDown(board: Square[]) {
  return moveBoard(board, i =>  i + numRows > numSquares - 1 ? i :  i + numRows, true)
}

function moveBoard(board: Square[], move: (i: number) => number, rtl: boolean = false) {

  const reducer = (newBoard: Square[], square: Square, i: number) => {  
    if (!square.zone) {
      return newBoard
    }

    const next = move(i)
        
    if (!newBoard[next].zone) {
      newBoard[next] = square
    }
    else if( newBoard[next].zone === square.zone) {
      newBoard[next] = {...square, value: square.value + newBoard[next].value}
    }
    else {
      newBoard[i] = square
    }

    return newBoard
  }

  const newBoard = createBoard()

  return rtl 
    ? board.reduceRight(reducer, newBoard)
    : board.reduce(reducer, newBoard)
}
