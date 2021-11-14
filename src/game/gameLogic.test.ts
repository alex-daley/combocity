import * as gameLogic from './gameLogic'

const numCols = gameLogic.numCols
const numRows = gameLogic.numRows

type Square = gameLogic.Square
type MoveFunction = (board: Square[]) => Square[]

function expectMove(move: MoveFunction, startAt: number, endAt: number) {
  const prev = gameLogic.createBoard()
  prev[startAt] = new gameLogic.Square('residential')

  const curr = move(prev)
  expect(curr[endAt].zone).toBe('residential')
}

function expectToNotMove(move: MoveFunction, index: number) {
  expectMove(move, index, index)
}

test('createBoard creates empty board of expected size', () => {
  expect(gameLogic.createBoard()).toHaveLength(gameLogic.numSquares)
  gameLogic.createBoard().forEach(square => expect(square.zone).toBeUndefined())
})

test('moveLeft moves square left when space is free', () => {
  expectMove(gameLogic.moveLeft, 2, 1)
  expectToNotMove(gameLogic.moveLeft, 0)
})

test('moveUp moves square up when space is free', () => {
  const start = (numCols * numRows) - 1
  const end = start - numCols
  expectMove(gameLogic.moveUp, start, end)
  expectToNotMove(gameLogic.moveUp, 0)
})

test('moveRight moves square right when space is free', () => {
  expectMove(gameLogic.moveRight, 2, 3)
  expectToNotMove(gameLogic.moveRight, numCols - 1)
})

test('moveDown moves square down when space is free', () => {
  expectMove(gameLogic.moveDown, 0, numCols)

  const end = (numCols * numRows) - 1
  expectToNotMove(gameLogic.moveDown, end)
})
