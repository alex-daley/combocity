import { useState, useEffect, useCallback } from 'react'
import * as gameLogic from './gameLogic'
import './game.css'

type Square = gameLogic.Square

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

function createHistory() {
  return {
    steps: [gameLogic.createAndPopulateBoard()],
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
