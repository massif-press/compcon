interface IInstanceable {
  ID: string;
  IsInstance: boolean;
  InstanceID?: string;

  IsLinked: boolean;

  CreateInstance<T>(): T;
  SetInstanceProxies<T>(data: T): void;
  Serialize(asInstance: boolean): any;
  GetLinkedItem<T>(): T;
}

export type { IInstanceable };
