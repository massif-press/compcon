interface IInstanceable {
  ID: string;
  IsInstance: boolean;
  InstanceID?: string;

  IsLinked: boolean;

  CreateInstance<T>(): T;
  Serialize(asInstance: boolean): any;
  GetLinkedItem<T>(): T;
}

export type { IInstanceable };
