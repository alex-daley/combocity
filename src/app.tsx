import { useState } from 'react'
import { randomBytes } from 'crypto'
import './app.css'

type Zone = 'residential'

interface Square {
  key: string
  value: null | Zone
}

function makeSquare(value = null): Square {
  return {
    key: randomBytes(16).toString('hex'),
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

function App() {
  const [squares, setSquares] = useState(makeBoard())

  const recreateBoard = () => setSquares(makeBoard())

  return (
    <section className="container">
      <div className="game-container">
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
    </section>
  )
}

export default App
