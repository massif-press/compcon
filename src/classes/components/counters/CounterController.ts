//TODO: ensure counters working

import uuid from 'uuid/v4'
import { ICounterData } from './Counter'
import { ICounterContainer } from './ICounterContainer'

interface ICounterCollection {
  counter_data: ICounterSaveData[]
  custom_counters: any[]
}

interface ICounterSaveData {
  id: string
  val: number
}

class CounterController {
  public readonly Parent: ICounterContainer

  private _counterSaveData: ICounterSaveData[]
  private _customCounters: ICounterData[]

  public constructor(parent: ICounterContainer) {
    this.Parent = parent
    this._counterSaveData = []
    this._customCounters = []
  }

  public get CounterSaveData(): ICounterSaveData[] {
    return this._counterSaveData
  }

  public saveCounter(inputData: ICounterSaveData): void {
    const index = this._counterSaveData.findIndex(datum => datum.id === inputData.id)
    if (index < 0) {
      this._counterSaveData = [...this._counterSaveData, inputData]
    } else {
      this._counterSaveData[index] = inputData
      this._counterSaveData = [...this._counterSaveData]
    }
    this.Parent.SaveController.save()
  }

  public get CustomCounterData(): ICounterData[] {
    return this._customCounters || []
  }

  public createCustomCounter(name: string): void {
    const counter = {
      name,
      id: uuid(),
      custom: true,
    }
    this._customCounters = [...this._customCounters, counter]
    this.Parent.SaveController.save()
  }

  public deleteCustomCounter(id: string): void {
    const index = this._customCounters.findIndex(c => c.custom && c.id === id)
    if (index > -1) {
      this._customCounters.splice(index, 1)
      this._customCounters = [...this._customCounters]
    }
    this.Parent.SaveController.save()
  }

  public get CounterData(): ICounterData[] {
    return [...this.Parent.FeatureController.Counters, ...this.CustomCounterData]
      .flat()
      .filter(x => x)
  }

  public static Serialize(parent: ICounterContainer, target: any) {
    target.counter_data = parent.CounterController.CounterData
    target.custom_counters = parent.CounterController.CustomCounterData
  }

  public static Deserialize(parent: ICounterContainer, data: ICounterCollection) {
    if (!parent.CounterController)
      throw new Error(
        `CounterController not found on parent (${typeof parent}). New CounterControllers must be instantiated in the parent's constructor method.`
      )

    parent.CounterController._counterSaveData = data.counter_data || []
    parent.CounterController._customCounters = (data.custom_counters as ICounterData[]) || []
  }
}

export { ICounterSaveData, ICounterCollection, CounterController }
