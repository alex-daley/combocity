import { useState, useEffect, useCallback } from 'react'
import { randomBytes } from 'crypto'
import './app.css'

const cols = 5
const rows = 5
const numSquares = cols * rows

interface Square {
  key: string
  value: null | 'residential'
}

function uuid() {
  return randomBytes(16).toString('hex')
}

function makeSquare(value = null): Square {
  return {
    key: uuid(),
    value
  }
}

function makeBoard() {
  const length = numSquares
  const squares = [...Array(length)].map(makeSquare)

  for (let i = 0; i <2; i++) {
    const index = Math.floor(Math.random() * length)
    squares[index] = {
      ...squares[index],
      value: 'residential'
    }
  }

  return squares
}

function indexAbove(index: number) {
  const next = index - cols
  return next < 0 ? index : next
}

function indexBelow(index: number) {
  const next = index + cols
  return next > numSquares ? index : next
}

function indexLeft(index: number) {
  return (index % cols) === 0 ? index : index - 1
}

function indexRight(index: number) {
  return (index % cols) === cols -1 ? index : index + 1
}

function shiftBoard(squares: Square[], shift: (index: number) => number) {
  const moved: number[] = []

  return squares.reduce((newSquares, square, i) => {
    if (Boolean(square.value)) {
      const nextIndex = shift(i)
      if (nextIndex !== i && !moved.includes(i)) {
        moved.push(nextIndex)
        newSquares[nextIndex].value = newSquares[i].value 
        newSquares[i].value = null
      }
    }

    return newSquares
  }, [...squares])
}

function Game() {
  const [squares, setSquares] = useState(makeBoard())
  const recreateBoard = () => setSquares(makeBoard())

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.repeat) return
    
    let shift
    switch (event.code) {
      case 'ArrowUp': 
        shift = indexAbove; 
        break
      case 'ArrowDown': 
        shift = indexBelow; 
        break
      case 'ArrowLeft':
        shift = indexLeft;
        break
      case 'ArrowRight':
        shift = indexRight
        break
      default:
        return;
    }

    setSquares(shiftBoard(squares, shift))
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
        {squares.map(square => (
          <div className="square-container" key={square.key}>
            <div className={`square ${square.value}`}></div>
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
