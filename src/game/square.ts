export type Zone =  'residential' | 'commercial' | 'industrial'

export default class Square {
  constructor(
    public readonly zone?: Zone, 
    public readonly value: number = 0) {
  }
}
