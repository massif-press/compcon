import { SaveController } from '../save/SaveController';
import { CloudController } from './CloudController';

interface ICloudSyncable {
  ID: string;
  Name: string;
  ItemType: string;
  CloudController: CloudController;
  SaveController: SaveController;

  Serialize(item: any);
  Update(data: any);
}

export type { ICloudSyncable };
