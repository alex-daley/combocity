import { useState, useEffect, useCallback } from 'react'
import './app.css'

const rows = 5
const numSquares = rows * rows

type Square = null | 'residential'

function createBoard(): Square[] {
  const squares = new Array<Square>(numSquares).fill(null)

  for (let i = 0; i < 4; i++) {
    const index = Math.floor(Math.random() * numSquares)
    squares[index] = 'residential'
  }

  return squares
}

function moveSquares(squares: Square[], keyCode: string) {
  const emptySquares = () => new Array<Square>(squares.length).fill(null)

  switch (keyCode) {
    case 'ArrowUp': {
      return squares.reduce((result, square, i) => {
        if (square) {
          result[indexAbove(i)] = square
        }
        return result
      }, emptySquares())
    }
    case 'ArrowDown': {
      return squares.reduceRight((result, square, i) => {
        if (square) {
          result[indexBelow(i)] = square
        }
        return result
      }, emptySquares())
    }
    case 'ArrowLeft': {
      return squares.reduce((result, square, i) => {
        if (square) {
          result[indexLeft(i)] = square
        }
        return result
      }, emptySquares())
    }
    case 'ArrowRight': {
      return squares.reduceRight((result, square, i) => {
        if (square) {
          result[indexRight(i)] = square
        }
        return result
      }, emptySquares())
    }
    default: {
      return squares
    }
  }
}

function indexAbove(index: number) {
  const next = index - rows
  return next < 0 ? index : next
}

function indexBelow(index: number) {
  const next = index + rows
  return next > numSquares - 1 ? index : next
}

function indexLeft(index: number) {
  return (index % rows) === 0 ? index : index - 1
}

function indexRight(index: number) {
  return (index % rows) === rows -1 ? index : index + 1
}

function Game() {
  const [squares, setSquares] = useState(createBoard())
  const recreateBoard = () => setSquares(createBoard())
  
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.repeat) return
    setSquares(moveSquares(squares, event.code))
  }, [squares])

  useEffect(() => {
    const eventName = 'keydown'
    document.addEventListener(eventName, handleKeyPress)
    return () => document.removeEventListener(eventName, handleKeyPress)
  }, [handleKeyPress])

  return (
    <div>
      <h1>Combocity</h1>
      <div className="board">
        {squares.map((square, i) => (
          <div className="square-container" key={i}>
            <div className={`square ${square}`}></div>
          </div>
        ))}
      </div>
      <div className="controls">
        <button onClick={recreateBoard}>
          Restart
        </button>
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
