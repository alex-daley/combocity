export const numRows = 5
export const numCols = numRows
export const numSquares = numRows * numCols

export type Square = null | 'residential' | 'commercial'  | 'industrial'

function randomBoardIndex(board: Square[]): number {
  const index = Math.floor(Math.random() * numSquares)
  return Boolean(board[index]) ? randomBoardIndex(board) : index
}

export function createBoard() {
  return new Array<Square>(numSquares).fill(null)
}

export function createAndPopulateBoard() {
  const squares = createBoard()
  for (let i = 0; i < 4; i++) squares[randomBoardIndex(squares)] = 'residential'
  squares[randomBoardIndex(squares)] = 'commercial'
  squares[randomBoardIndex(squares)] = 'industrial'

  return squares
}

// TODO: Reduce repetition

export function moveLeft(board: Square[]) {
  return board.reduce((newBoard, square, i) => {
    if (square) {
      const left = (i % numCols) === 0 ? i : i - 1
      if (!newBoard[left] || newBoard[left] === square) {
        newBoard[left] = square
      }
      else {
        newBoard[i] = square
      }
    }

    return newBoard
  }, createBoard())
}

export function moveUp(board: Square[]) {
  return board.reduce((newBoard, square, i) => {
    if (square) {
      const up = i - numRows < 0 ? i : i - numRows
      if (!newBoard[up] || newBoard[up] === square) {
        newBoard[up] = square
      }
      else {
        newBoard[i] = square
      }
    }

    return newBoard
  }, createBoard())
}

export function moveRight(board: Square[]) {
  return board.reduceRight((newBoard, square, i) => {
    if (square) {
      const right = (i % numCols) === numCols - 1 ? i : i + 1
      if (!newBoard[right] || newBoard[right] === square) {
        newBoard[right] = square
      }
      else {
        newBoard[i] = square
      }
    }

    return newBoard
  }, createBoard())
}

export function moveDown(board: Square[]) {
  return board.reduceRight((newBoard, square, i) => {
    if (square) {
      const down = i + numRows > numSquares - 1 ? i :  i + numRows 
      if (!newBoard[down] || newBoard[down] === square) {
        newBoard[down] = square
      }
      else {
        newBoard[i] = square
      }
    }

    return newBoard
  }, createBoard())
}
