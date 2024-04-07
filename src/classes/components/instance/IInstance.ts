import { IInstanceData } from './IInstanceData';
import { IInstanceable } from './IInstanceable';

interface IInstance {
  Item: IInstanceable;
  Source: any;
  SourceId: string;
  SourceData: any;

  IsLinked: boolean;

  LinkSource(id: string): void;
  UnlinkSource(): void;
}

export type { IInstance };
