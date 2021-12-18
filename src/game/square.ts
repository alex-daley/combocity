
export const zones = ['residential', 'commercial', 'industrial'] as const
export type Zone = typeof zones[number]

export default class Square {
  constructor(
    public readonly zone?: Zone, 
    public readonly value: number = 0) {
  }
}
