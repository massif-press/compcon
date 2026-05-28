import { v4 as uuid } from 'uuid'

interface IInstanceableData {
  instanceId: string | undefined;
}

interface IInstanceable {
  ID: string;
  IsInstance: boolean;
  InstanceID?: string;

  IsLinked: boolean;

  CreateInstance<T>(): T;
  Serialize(asInstance: boolean): any;
  GetLinkedItem<T>(): T;
}

function buildInstanceData(): IInstanceableData {
  return { instanceId: uuid() }
}

export type { IInstanceableData, IInstanceable }
export { buildInstanceData }
