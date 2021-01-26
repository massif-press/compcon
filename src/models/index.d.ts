import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class UserData {
  readonly id: string;
  readonly user_id: string;
  readonly theme?: string;
  readonly achievements?: string[];
  readonly lcp_data?: string;
  readonly pilots?: string[];
  readonly npcs?: string[];
  readonly encounters?: string[];
  readonly missions?: string[];
  readonly active_missions?: string[];
  readonly welcome_hash?: string;
  readonly sync_frequency?: string;
  readonly sync_options?: string;
  readonly view_options?: string;
  constructor(init: ModelInit<UserData>);
  static copyOf(source: UserData, mutator: (draft: MutableModel<UserData>) => MutableModel<UserData> | void): UserData;
}