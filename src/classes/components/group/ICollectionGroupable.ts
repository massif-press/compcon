import { SaveController } from "../save/SaveController";
import { GroupController } from "./GroupController";

interface ICollectionGroupable {
  GroupController: GroupController
  SaveController: SaveController
}

export {
  ICollectionGroupable
}