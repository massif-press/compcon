import { Pilot } from '../Pilot'

interface IRankedWrapper {
  readonly Rank: number
  Increment(): void
  Decrement(): void
}

abstract class RankedCollectionController<TRaw, TWrapper extends IRankedWrapper> {
  public readonly Parent: Pilot
  protected _collection: TWrapper[] = []

  public constructor(parent: Pilot) {
    this.Parent = parent
  }

  protected abstract _findIndex(raw: TRaw): number
  protected abstract _createWrapper(raw: TRaw): TWrapper
  protected abstract _getRaw(wrapper: TWrapper): TRaw | null

  protected _sort(): void {}
  protected _afterAdd(_raw: TRaw): void {}
  protected _afterRemove(_raw: TRaw): void {}

  protected _addItem(raw: TRaw): void {
    const index = this._findIndex(raw)
    if (index === -1) {
      this._collection.push(this._createWrapper(raw))
    } else {
      this._collection[index].Increment()
    }
    this._sort()
    this._afterAdd(raw)
    this.Parent.SaveController.save()
  }

  protected _removeItem(raw: TRaw): void {
    const index = this._findIndex(raw)
    if (index !== -1) {
      if (this._collection[index].Rank > 1) {
        this._collection[index].Decrement()
      } else {
        this._collection.splice(index, 1)
      }
    }
    this._sort()
    this._afterRemove(raw)
    this.Parent.SaveController.save()
  }

  protected _clearCollection(): void {
    for (let i = this._collection.length - 1; i >= 0; i--) {
      while (this._collection[i]) {
        const raw = this._getRaw(this._collection[i])
        if (!raw) break
        this._removeItem(raw)
      }
    }
  }

  public get CurrentPoints(): number {
    return this._collection.reduce((sum, x) => sum + x.Rank, 0)
  }

  public abstract get MaxPoints(): number

  public get IsMissing(): boolean {
    return this.CurrentPoints < this.MaxPoints
  }

  public get HasFull(): boolean {
    return this.CurrentPoints === this.MaxPoints
  }
}

export { RankedCollectionController }
export type { IRankedWrapper }
