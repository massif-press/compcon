import { IInstanceContainer } from './IInstanceContainer';
import { IInstanceable } from './IInstanceable';

class InstanceController {
  public readonly Parent: IInstanceContainer;

  constructor(parent: IInstanceContainer) {
    this.Parent = parent;
  }

  public save(): void {
    this.Parent.SaveController.save();
  }

  public AddInstance(source: IInstanceable): void {
    //instance factory
  }
}

export { InstanceController };
