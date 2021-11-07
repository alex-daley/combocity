import { useState, useEffect, useCallback } from 'react'
import './app.css'

const rows = 5
const numSquares = rows ** 2

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
  const result = new Array<Square>(squares.length).fill(null)
  
  switch (keyCode) {
    case 'ArrowUp':  {
      for (let i = 0; i < squares.length; i++) {        
        if (!squares[i]) 
          continue
        if (i - rows >= 0) {
          result[i - rows] = squares[i]
        } 
        else {
          result[i] = squares[i]
        }
      }

      break
    }
    case 'ArrowDown': {
      for (let i = squares.length - 1; i >= 0; i--) {
        if (!squares[i])
          continue
        if (i + rows < numSquares) {
          result[i + rows] = squares[i]
        }
        else {
          result[i] = squares[i]
        }
      }

      break
    }
    case 'ArrowLeft': {
      for (let i = 0; i < squares.length; i++) {        
        if (!squares[i]) 
          continue
        if ((i % rows) !== 0) {
          result[i - 1] = squares[i]
        }
        else {
          result[i] = squares[i]
        }
      }

      break   
    }
    case 'ArrowRight': {
      for (let i = squares.length - 1; i >= 0; i--) {
        if (!squares[i]) 
          continue
        if ((i % rows) !== rows - 1) {
          result[i + 1] = squares[i]
        }
        else {
          result[i] = squares[i]
        }
      }

      break
    }
  }

  return result
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
