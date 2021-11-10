export const numRows = 5
export const numCols = numRows
export const numSquares = numRows * numCols

export type Square = null | 'residential'

export function createBoard() {
  return new Array<Square>(numSquares).fill(null)
}

export function createAndPopulateBoard() {
  const squares = createBoard()
  for (let i = 0; i < 4; i++) {
    const index = Math.floor(Math.random() * numSquares)
    squares[index] = 'residential'
  }

  return squares
}

export function moveLeft(board: Square[]) {
  return board.reduce((newBoard, square, i) => {
    if (square) {
      const left = (i % numCols) === 0 ? i : i - 1
      newBoard[left] = square
    }

    return newBoard
  }, createBoard())
}

export function moveUp(board: Square[]) {
  return board.reduce((newBoard, square, i) => {
    if (square) {
      const up = i - numRows < 0 ? i : i - numRows
      newBoard[up] = square
    }

    return newBoard
  }, createBoard())
}

export function moveRight(board: Square[]) {
  return board.reduceRight((newBoard, square, i) => {
    if (square) {
      const right = (i % numCols) === numCols - 1 ? i : i + 1
      newBoard[right] = square
    }

    return newBoard
  }, createBoard())
}

export function moveDown(board: Square[]) {
  return board.reduceRight((newBoard, square, i) => {
    if (square) {
      const down = i + numRows > numSquares - 1 ? i :  i + numRows 
      newBoard[down] = square
    }

    return newBoard
  }, createBoard())
}
