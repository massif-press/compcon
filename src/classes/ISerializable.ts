export interface ISerializableStatic<TData, TInstance> {
  Serialize(instance: TInstance): TData

  Deserialize(data: TData, ...args: any[]): TInstance
}
