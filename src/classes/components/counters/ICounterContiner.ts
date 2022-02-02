import { SaveController } from "../save/SaveController";
import { ICounterData } from "./Counter";
import { CounterController } from "./CounterController";

interface ICounterContainer {
  CounterController: CounterController
  SaveController: SaveController

  Counters: ICounterData[]
}

export {
  ICounterContainer
}