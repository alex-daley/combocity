import { useState, useEffect, useCallback } from 'react'
import './app.css'

const rows = 5
const numSquares = rows * rows

type Square = null | 'residential'

function createBoard() {
  return new Array<Square>(numSquares).fill(null)
}

function createAndPopulateBoard() {
  const squares = createBoard()
  for (let i = 0; i < 4; i++) {
    const index = Math.floor(Math.random() * numSquares)
    squares[index] = 'residential'
  }

  return squares
}

function moveLeft(board: Square[]) {
  return board.reduce((newBoard, square, i) => {
    if (square) {
      const left = (i % rows) === 0 ? i : i - 1
      newBoard[left] = square
    }

    return newBoard
  }, createBoard())
}

function moveUp(board: Square[]) {
  return board.reduce((newBoard, square, i) => {
    if (square) {
      const up = i - rows < 0 ? i : i - rows
      newBoard[up] = square
    }

    return newBoard
  }, createBoard())
}

function moveRight(board: Square[]) {
  return board.reduceRight((newBoard, square, i) => {
    if (square) {
      const right = (i % rows) === rows - 1 ? i : i + 1
      newBoard[right] = square
    }

    return newBoard
  }, createBoard())
}

function moveDown(board: Square[]) {
  return board.reduceRight((newBoard, square, i) => {
    if (square) {
      const down = i + rows > numSquares - 1 ? i :  i + rows 
      newBoard[down] = square
    }

    return newBoard
  }, createBoard())
}

function move(board: Square[], keyCode: string) {
  switch (keyCode) {
    case 'ArrowLeft': 
      return moveLeft(board)
    case 'ArrowUp':
      return moveUp(board)
    case 'ArrowRight':
      return moveRight(board)
    case 'ArrowDown': 
      return moveDown(board)
    default: 
      return board
  }
}

function createHistory() {
  return {
    steps: [createAndPopulateBoard()],
    index: 0
  }
}

function Game() {
  const [history, setHistory] = useState(createHistory)
  const board = history.steps[history.index] 

  const reset = () => {
    setHistory(createHistory)
  }

  const undo = () => {
    setHistory(history => ({
      ...history,
      index: Math.max(history.index - 1, 0)
    }))
  }

  const redo = () => {
    setHistory(history => ({
      ...history,
      index: Math.min(history.index + 1, history.steps.length)
    }))
  }

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.repeat) return
    const next = move(board, event.code)
    
    setHistory(history => ({
      index: history.index + 1,
      steps: history.steps.slice(0, history.index + 1).concat([next]) 
    }))
    
  }, [board])

  useEffect(() => {
    const eventName = 'keydown'
    document.addEventListener(eventName, handleKeyPress)
    return () => document.removeEventListener(eventName, handleKeyPress)
  }, [handleKeyPress])

  return (
    <div>
      <h1>Combocity</h1>
      <div className="board">
        {board.map((square, i) => (
          <div className="square-container" key={i}>
            <div className={`square ${square}`}></div>
          </div>
        ))}
      </div>
      <div className="controls">
        <div>
          <button onClick={reset}>
            Restart
          </button>
        </div>
        <div className="rewind-controls">
          <button 
            onClick={undo} 
            disabled={history.index < 1}
          >
            UNDO
          </button>
          <button 
            onClick={redo} 
            disabled={history.index === history.steps.length -1}
          >
            REDO
          </button>
          {history.index + 1 != history.steps.length ?
            <div>{history.index + 1} of {history.steps.length}</div> :
            <div className="fadeout">All caught up!</div>
          }
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <section className="game-container">
      <Game />
    </section>
  )
}

export default App
