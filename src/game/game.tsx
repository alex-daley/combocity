import * as React from 'react'
import * as GameLogic from './gameLogic'
import Colours from './colours'
import ScoreBar from './scoreBar'
import Square, { zones } from './square'
import './game.css'
import './animations.css'

type Direction = 'left' | 'up' | 'right' | 'down'

interface History {
  steps: Square[][],
  index: number,
  direction?: Direction
}

const animationTimeout = 200
const keyToDirection: Record<string, Direction> = {
  'ArrowLeft': 'left',
  'ArrowUp': 'up',
  'ArrowRight': 'right',
  'ArrowDown': 'down'
} as const

function move(board: Square[], keyCode: string) {
  switch (keyCode) {
    case 'ArrowLeft':
      return GameLogic.moveLeft(board)
    case 'ArrowUp':
      return GameLogic.moveUp(board)
    case 'ArrowRight':
      return GameLogic.moveRight(board)
    case 'ArrowDown':
      return GameLogic.moveDown(board)
    default:
      return board
  }
}

function createHistory(): History {
  return {
    steps: [GameLogic.createAndPopulateBoard()],
    index: 0
  }
}

function Game() {
  const [history, setHistory] = React.useState(createHistory)
  const board = history.steps[history.index]
  const direction = history.direction

  const reset = () => {
    setHistory(createHistory)
  }

  const undo = () => {
    setHistory(history => ({ ...history, index: Math.max(history.index - 1, 0) }))
  }

  const redo = () => {
    setHistory(history => ({ ...history, index: Math.min(history.index + 1, history.steps.length) }))
  }


  const hasMoved = (index: number) => {
    if (history.steps.length < 2 || history.index < 1) return false
    const curr = history.steps[history.index][index]
    const prev = history.steps[history.index - 1][index]
    return curr !== prev
  }

  const handleKeyPress = React.useCallback((event: KeyboardEvent) => {
    if (event.repeat) return
    const next = move(board, event.code)

    setHistory(history => ({
      index: history.index + 1,
      steps: history.steps.slice(0, history.index + 1).concat([next]),
      direction: keyToDirection[event.code]
    }))

    setTimeout(() => {
      setHistory(history => ({ ...history, direction: undefined }))
    }, animationTimeout)

  }, [board])

  React.useEffect(() => {
    const eventName = 'keydown'
    document.addEventListener(eventName, handleKeyPress)
    return () => document.removeEventListener(eventName, handleKeyPress)
  }, [handleKeyPress])
  
  return (
    <div>
      <h1>Combocity</h1>

      <div className="game">
        <div>
          <div className="board">
            {board.map((square, i) => (
              <div className="square-container" key={i}>
                <div className={`square ${square.zone} ${square.zone && hasMoved(i) ? direction : ''}`}>
                  <p>{square.value < 1 ? '' : square.value}</p>
                </div>
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
              <button onClick={undo} disabled={history.index < 1}>UNDO</button>
              <button onClick={redo} disabled={history.index === history.steps.length - 1}>REDO</button>
              {history.index + 1 !== history.steps.length ?
                <div>{history.index + 1} of {history.steps.length}</div> :
                <div className="fadeout">All caught up!</div>}
            </div>
          </div>
        </div>

        <div className="score-bars">
          {zones.map(zone => (
            <ScoreBar 
              key={zone}
              maxScore={GameLogic.sumScores(board)}
              score={GameLogic.sumScoresOfZone(board, zone)}
              fill={Colours[zone]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Game
