export interface ISerializableStatic<TData, TInstance> {
  Serialize(instance: TInstance): TData

  Deserialize(data: TData, ...args: any[]): TInstance
}

export interface IControllerStatic<TParent, TData> {
  Serialize(parent: TParent, target: any, ...args: any[]): void

  Deserialize(parent: TParent, data: TData): void
}
