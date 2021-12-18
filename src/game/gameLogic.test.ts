import * as game from './gameLogic'
import SquareProps, { Zone } from './square'

function createBoard(...args: [index: number, zone: Zone, value: number][]) {
  const board = game.createBoard()
  args.forEach(([index, zone, value]) => {
    board[index] = new SquareProps(zone, value)
  })

  return board
}

describe('moveLeft', () => {
  test('moves square left', () => {
    const i = 1
    const prev = createBoard([i, 'residential', 2])
    const curr = game.moveLeft(prev)
    expect(curr[i - 1]).toEqual(prev[i])
    expect(curr[i]).not.toEqual(prev[i])
  })

  test('does not move square left when at left edge', () => {
    const i = 0
    const prev = createBoard([i, 'residential', 2])
    const curr = game.moveLeft(prev)
    expect(curr[i]).toEqual(prev[i])
  })

  test('merges squares of same zone when at left edge', () => {
    const i = 0
    const prev = createBoard([i, 'residential', 2], [i + 1, 'residential', 2])
    const curr = game.moveLeft(prev)
    expect(curr[i]).toEqual({ zone: 'residential', value: 4 })
  })

  test('does not combine when squares are at left edge but have different zones', () => {
    const i = 1
    const prev = createBoard([i, 'residential', 2], [0, 'commercial', 2])
    const curr = game.moveLeft(prev)
    expect(curr[i]).toEqual(prev[i])
    expect(curr[0]).toEqual(prev[0])
  })
})

describe('moveRight', () => {
  const rightCornerIndex = game.numCols - 1

  test('moves square right', () => {
    const i = 0
    const prev = createBoard([i, 'residential', 2])
    const curr = game.moveRight(prev)
    expect(curr[i + 1]).toEqual(prev[i])
    expect(curr[i]).not.toEqual(prev[i])
  })

  test('does not move square right when at right edge', () => {
    const i = rightCornerIndex
    const prev = createBoard([i, 'residential', 2])
    const curr = game.moveRight(prev)
    expect(curr[i]).toEqual(prev[i])
  })

  test('merges squares of same zone when at right edge', () => {
    const i = rightCornerIndex
    const prev = createBoard([i, 'residential', 2], [i - 1, 'residential', 2])
    const curr = game.moveRight(prev)
    expect(curr[i]).toEqual({ zone: 'residential', value: 4 })
  })

  test('does not combine when squares are at right edge but have different zones', () => {
    const i = rightCornerIndex
    const prev = createBoard([i - 1, 'residential', 2], [i, 'commercial', 2])
    const curr = game.moveRight(prev)
    expect(curr[i]).toEqual(prev[i])
    expect(curr[i - 1]).toEqual(prev[i - 1])
  })
})

describe('moveUp', () => {
  test('moves square up', () => {
    const i = game.numCols
    const prev = createBoard([i, 'residential', 2])
    const curr = game.moveUp(prev)
    expect(curr[0]).toEqual(prev[i])
    expect(curr[i]).not.toEqual(prev[i])
  })

  test('does not move square up when at top edge', () => {
    const i = 0
    const prev = createBoard([i, 'residential', 2])
    const curr = game.moveUp(prev)
    expect(curr[i]).toEqual(prev[i])
  })

  test('merges squares of same zone when at top edge', () => {
    const i = 0
    const prev = createBoard([i, 'residential', 2], [game.numCols, 'residential', 2])
    const curr = game.moveUp(prev)
    expect(curr[i]).toEqual({ zone: 'residential', value: 4 })
  })

  test('does not combine when squares are at top edge but have different zones', () => {
    const i = 0
    const prev = createBoard([i, 'residential', 2], [game.numCols, 'commercial', 2])
    const curr = game.moveUp(prev)
    expect(curr[i]).toEqual(prev[i])
    expect(curr[game.numCols]).toEqual(prev[game.numCols])
  })
})

describe('moveDown', () => {
  test('moves square down', () => {
    const i = 0
    const prev = createBoard([i, 'residential', 2])
    const curr = game.moveDown(prev)
    expect(curr[game.numCols]).toEqual(prev[i])
    expect(curr[i]).not.toEqual(prev[i])
  })

  test('does not move square down when at bottom edge', () => {
    const i = game.numSquares - 1
    const prev = createBoard([i, 'residential', 2])
    const curr = game.moveDown(prev)
    expect(curr[i]).toEqual(prev[i])
  })

  test('merges squares of same zone when at bottom edge', () => {
    const i = game.numSquares - 1
    const prev = createBoard([i, 'residential', 2], [i - game.numCols, 'residential', 2])
    const curr = game.moveDown(prev)
    expect(curr[i]).toEqual({ zone: 'residential', value: 4 })
  })

  test('does not combine when squares are at bottom edge but have different zones', () => {
    const i = game.numSquares - 1
    const prev = createBoard([i, 'residential', 2], [i - game.numCols, 'commercial', 2])
    const curr = game.moveDown(prev)
    expect(curr[i]).toEqual(prev[i])
    expect(curr[game.numCols]).toEqual(prev[game.numCols])
  })
})

describe('getSquaresByZone', () => {
  test('returns squares in board of desired zone', () => {
    const board = createBoard(
      [0, 'residential', 2],
      [1, 'residential', 4],
      [3, 'commercial', 6])
    
    const residential = game.getSquaresByZone(board, 'residential')
    expect(residential).toHaveLength(2)
    expect(residential).toContainEqual({ zone: 'residential', value: 2 })
    expect(residential).toContainEqual({ zone: 'residential', value: 4 })
    
    const commercial = game.getSquaresByZone(board, 'commercial')
    expect(commercial).toHaveLength(1)
    expect(commercial).toContainEqual({ zone: 'commercial', value: 6 })
  })
})

describe('sumScores', () => {
  test('returns sum of values of squares', () => {
    const board = createBoard(
      [0, 'residential', 2],
      [1, 'residential', 4],
      [2, 'commercial', 4],
      [3, 'commercial', 6], 
      [6, 'industrial', 3],
      [7, 'industrial', 4])

    const sum = game.sumScores(board)
    expect(sum).toBe(23)
  })
})

describe('sumScoresOfZone', () => {
  test('returns sum of values of squares of desired zone', () => {
    const board = createBoard(
      [0, 'residential', 2],
      [1, 'residential', 4],
      [2, 'commercial', 4],
      [3, 'commercial', 6], 
      [6, 'industrial', 3],
      [7, 'industrial', 4])

    const residential = game.sumScoresOfZone(board, 'residential')
    expect(residential).toBe(6)

    const commercial = game.sumScoresOfZone(board, 'commercial')
    expect(commercial).toBe(10)

    const industrial = game.sumScoresOfZone(board, 'industrial')
    expect(industrial).toBe(7)
  })
})
