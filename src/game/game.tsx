import { useState, useEffect, useCallback } from 'react'
import * as gameLogic from './gameLogic'
import Square from './square'
import './game.css'
import './animations.css'

type Direction = 'left' | 'up' | 'right' | 'down'

interface History {
  steps: Square[][],
  index: number,
  direction?: Direction
}

const animationMs = 200

const keyToDirection: Record<string, Direction> = {
  'ArrowLeft': 'left',
  'ArrowUp': 'up',
  'ArrowRight': 'right',
  'ArrowDown': 'down'
}

function move(board: Square[], keyCode: string) {
  switch (keyCode) {
    case 'ArrowLeft':
      return gameLogic.moveLeft(board)
    case 'ArrowUp':
      return gameLogic.moveUp(board)
    case 'ArrowRight':
      return gameLogic.moveRight(board)
    case 'ArrowDown':
      return gameLogic.moveDown(board)
    default:
      return board
  }
}

function createHistory(): History {
  return {
    steps: [gameLogic.createAndPopulateBoard()],
    index: 0
  }
}

function Game() {
  const [history, setHistory] = useState(createHistory)
  const board = history.steps[history.index]
  const direction = history.direction

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
      steps: history.steps.slice(0, history.index + 1).concat([next]),
      direction: keyToDirection[event.code]
    }))

    // HACK: To clear animation class names.
    setTimeout(() => {
      setHistory(history => ({
        ...history,
        direction: undefined
      }))
    }, animationMs)

  }, [board])

  const hasMoved = (index: number) => {
    if (history.steps.length < 2 || history.index < 1) return false
    const curr = history.steps[history.index][index]
    const prev = history.steps[history.index - 1][index]
    return curr !== prev
  }

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
          <button
            onClick={undo}
            disabled={history.index < 1}
          >
            UNDO
          </button>
          <button
            onClick={redo}
            disabled={history.index === history.steps.length - 1}
          >
            REDO
          </button>
          {history.index + 1 !== history.steps.length ?
            <div>{history.index + 1} of {history.steps.length}</div> :
            <div className="fadeout">All caught up!</div>
          }
        </div>
      </div>
    </div>
  )
}

export default Game
