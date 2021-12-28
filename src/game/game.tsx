import * as React from 'react'
import * as GameLogic from './gameLogic'
import SquareInterface, { Zone, zones } from './square'
import './game.css'

interface GameState {
  history: SquareInterface[][]
  historyStepIndex: number
}

interface ScoreBarProps {
  squares: SquareInterface[]
}

interface BoardProps {
  squares: SquareInterface[]
}

interface PlaybackControlsProps {
  onUndo: () => void
  onRedo: () => void
  onRestart: () => void
  state: GameState
}

interface ProgressProps {
  colour: string
  percentage: number
  value?: number
}

interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
}

const moveBindings: Record<string, (squares: SquareInterface[]) => SquareInterface[]> = {
  'ArrowLeft': GameLogic.moveLeft,
  'ArrowUp': GameLogic.moveUp,
  'ArrowRight': GameLogic.moveRight,
  'ArrowDown': GameLogic.moveDown
}

function initalGameState(): GameState {
  return {
    history: [GameLogic.createAndPopulateBoard()],
    historyStepIndex: 0
  }
}

function currentBoard({ history, historyStepIndex }: GameState) {
  return history[historyStepIndex]
}

function undoHistoryStep(state: GameState) {
  const historyStepIndex = Math.max(state.historyStepIndex - 1, 0)
  return { ...state, historyStepIndex }
}

function redoHistoryStep(state: GameState) {
  const historyStepIndex = Math.min(state.historyStepIndex + 1, state.history.length)
  return { ...state, historyStepIndex }
}

function isMoveKey(keyCode: string) {
  return Boolean(moveBindings[keyCode])
}

function move(board: SquareInterface[], keyCode: string) {
  if (!isMoveKey(keyCode)) return board
  return moveBindings[keyCode](board)
}

function addNewSquare(board: SquareInterface[]) {
  const index = GameLogic.randomEmptySquare(board)
  if (!index) return board 

  const zone =  zones[Math.floor(Math.random() * zones.length)]
  board[index] = { zone, value: 2 }
  return board
}

function classNames(...names: (string | undefined)[]) {
  const truthy = names.filter(name => Boolean(name))
  if (truthy.length === 0) return ''
  return truthy.splice(1).reduce((composite, className) => {
    return `${composite} ${className}`
  }, truthy[0])
}

function Board({ squares }: BoardProps) {
  const getSquareClass = (square: SquareInterface) => {
    return classNames('square', square.zone)
  }

  return (
    <div className="board">
      {squares.map((square, i) => (
        <div
          className="square-container"
          key={i}
        >
          <div className={getSquareClass(square)}>
            {square.value ? <p>{square.value}</p> : <></>}
          </div>
        </div>
      ))}
    </div>
  )
}

function PlaybackControls(props: PlaybackControlsProps) {
  const Button = (props: ButtonProps) => (
    <button className="button" {...props} >
      {props.children}
    </button>
  )

  const { state: { history, historyStepIndex } } = props
  const undoDisabled = historyStepIndex < 1
  const redoDisabled = historyStepIndex === (history.length - 1)

  return (
    <div className="playback-controls" >
      <div>
        <Button
          onClick={props.onRestart}
        >
          Restart
        </Button>
      </div>
      <div className="undo-redo">
        <Button
          onClick={props.onUndo}
          disabled={undoDisabled}
        >
          Undo
        </Button>
        <Button
          onClick={props.onRedo}
          disabled={redoDisabled}
        >
          Redo
        </Button>
        {historyStepIndex + 1 !== history.length ?
          <div>{historyStepIndex + 1} of {history.length}</div> :
          <div className="fadeout">All caught up!</div>}
      </div>
    </div>
  )
}

function Progress(props: ProgressProps) {
  const style = {
    backgroundColor: props.colour,
    width: `${props.percentage}%`,
    height: '100%'
  }

  return (
    <div className="progress-container">
      <div className="progress-text">
        {props.value}
      </div>
      <div className="progress">
        <div style={style} />
      </div>
    </div>
  )
}

function ScoreBars({ squares }: ScoreBarProps) {
  const sum = GameLogic.sumScores(squares)

  const scorePercentage = (value: number) => (value / sum) * 100
  const scorePercentageZone = (zone: Zone) => {
    const value = GameLogic.sumScoresOfZone(squares, zone)
    return { value, percentage: scorePercentage(value) }
  }

  return (
    <div className="score-bars" >
      <Progress
        colour="#8DFF00FF"
        {...scorePercentageZone('residential')}
      />
      <Progress
        colour="#14E6F5FF"
        {...scorePercentageZone('commercial')}
      />
      <Progress
        colour="#FF9000FF"
        {...scorePercentageZone('industrial')}
      />
    </div>
  )
}

export default function Game() {
  const [state, setState] = React.useState(initalGameState)
  const squares = currentBoard(state)

  const undo = () => setState(undoHistoryStep(state))
  const redo = () => setState(redoHistoryStep(state))
  const restart = () => setState(initalGameState())

  const handleKeyPress = React.useCallback((event: KeyboardEvent) => {
    if (event.repeat || !isMoveKey(event.code)) return
    const next = addNewSquare(move(squares, event.code))

    setState(state => ({
      historyStepIndex: state.historyStepIndex + 1,
      history: state.history.slice(0, state.historyStepIndex + 1).concat([next])
    }))
  }, [squares])

  React.useEffect(() => {
    const eventName = 'keydown'
    document.addEventListener(eventName, handleKeyPress)
    return () => document.removeEventListener(eventName, handleKeyPress)
  }, [handleKeyPress])

  return (
    <div className="game-root">
      <h1>Multiplicity</h1>
      <ScoreBars squares={squares} />
      <Board squares={squares} />
      <PlaybackControls
        onUndo={undo}
        onRedo={redo}
        onRestart={restart}
        state={state}
      />
    </div>
  )
}
