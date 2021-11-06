import { useState } from 'react'
import { randomBytes } from 'crypto'
import './app.css'

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

function makeBoard(length: number = 25) {
  const squares = [...Array(length)].map(makeSquare)

  for (let i = 0; i < Math.floor(length / 2); i++) {
    const index = Math.floor(Math.random() * length)
    squares[index] = {
      ...squares[index],
      value: 'residential'
    }
  }

  return squares
}

function Game() {
  const [squares, setSquares] = useState(makeBoard())

  const recreateBoard = () => setSquares(makeBoard())

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
