import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





export declare class UserData {
  readonly id: string;
  readonly user_id: string;
  readonly theme?: string;
  readonly achievements?: (string | null)[];
  readonly lcp_data?: string;
  readonly pilots?: (string | null)[];
  readonly npcs?: (string | null)[];
  readonly encounters?: (string | null)[];
  readonly missions?: (string | null)[];
  readonly active_missions?: (string | null)[];
  readonly welcome_hash?: string;
  readonly sync_frequency?: string;
  readonly sync_options?: string;
  readonly view_options?: string;
  constructor(init: ModelInit<UserData>);
  static copyOf(source: UserData, mutator: (draft: MutableModel<UserData>) => MutableModel<UserData> | void): UserData;
}