import { SaveController } from "../save/SaveController";
import { CloudController } from "./CloudController";

interface ICloudSyncable {
  CloudController: CloudController
  SaveController: SaveController
}

export {
  ICloudSyncable
}