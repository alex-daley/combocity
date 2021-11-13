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

export function moveLeft(board: Square[]) {
  return move(board, i => (i % numCols) === 0 ? i : i - 1)
}

export function moveUp(board: Square[]) {
  return move(board, i => i - numRows < 0 ? i : i - numRows)
}

export function moveRight(board: Square[]) {
  return move(board, i => (i % numCols) === numCols - 1 ? i : i + 1, true)
}

export function moveDown(board: Square[]) {
  return move(board, i =>  i + numRows > numSquares - 1 ? i :  i + numRows, true)
}

function move(board: Square[], nextSquareIndex: (index: number) => number, rtl: boolean = false) {

  const reducer = (newBoard: Square[], square: Square, i: number) => {  
    if (!square) {
      return newBoard
    }

    const next = nextSquareIndex(i)
        
    if (!newBoard[next] || newBoard[next] === square) {
      newBoard[next] = square
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
