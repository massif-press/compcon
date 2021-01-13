/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreatePilotDataInput = {
  id?: string | null,
  data: string,
  userdataID: string,
};

export type ModelPilotDataConditionInput = {
  data?: ModelStringInput | null,
  userdataID?: ModelIDInput | null,
  and?: Array< ModelPilotDataConditionInput | null > | null,
  or?: Array< ModelPilotDataConditionInput | null > | null,
  not?: ModelPilotDataConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type UpdatePilotDataInput = {
  id: string,
  data?: string | null,
  userdataID?: string | null,
};

export type DeletePilotDataInput = {
  id?: string | null,
};

export type CreateUserDataInput = {
  id?: string | null,
  achievements?: Array< string | null > | null,
  selectorView?: string | null,
  npcView?: string | null,
  rosterView?: string | null,
  hangarView?: string | null,
  pilotSheetView?: string | null,
  theme?: string | null,
  welcome_hash?: string | null,
};

export type ModelUserDataConditionInput = {
  achievements?: ModelStringInput | null,
  selectorView?: ModelStringInput | null,
  npcView?: ModelStringInput | null,
  rosterView?: ModelStringInput | null,
  hangarView?: ModelStringInput | null,
  pilotSheetView?: ModelStringInput | null,
  theme?: ModelStringInput | null,
  welcome_hash?: ModelStringInput | null,
  and?: Array< ModelUserDataConditionInput | null > | null,
  or?: Array< ModelUserDataConditionInput | null > | null,
  not?: ModelUserDataConditionInput | null,
};

export type UpdateUserDataInput = {
  id: string,
  achievements?: Array< string | null > | null,
  selectorView?: string | null,
  npcView?: string | null,
  rosterView?: string | null,
  hangarView?: string | null,
  pilotSheetView?: string | null,
  theme?: string | null,
  welcome_hash?: string | null,
};

export type DeleteUserDataInput = {
  id?: string | null,
};

export type ModelPilotDataFilterInput = {
  id?: ModelIDInput | null,
  data?: ModelStringInput | null,
  userdataID?: ModelIDInput | null,
  and?: Array< ModelPilotDataFilterInput | null > | null,
  or?: Array< ModelPilotDataFilterInput | null > | null,
  not?: ModelPilotDataFilterInput | null,
};

export type ModelUserDataFilterInput = {
  id?: ModelIDInput | null,
  achievements?: ModelStringInput | null,
  selectorView?: ModelStringInput | null,
  npcView?: ModelStringInput | null,
  rosterView?: ModelStringInput | null,
  hangarView?: ModelStringInput | null,
  pilotSheetView?: ModelStringInput | null,
  theme?: ModelStringInput | null,
  welcome_hash?: ModelStringInput | null,
  and?: Array< ModelUserDataFilterInput | null > | null,
  or?: Array< ModelUserDataFilterInput | null > | null,
  not?: ModelUserDataFilterInput | null,
};

export type CreatePilotDataMutationVariables = {
  input: CreatePilotDataInput,
  condition?: ModelPilotDataConditionInput | null,
};

export type CreatePilotDataMutation = {
  createPilotData:  {
    __typename: "PilotData",
    id: string,
    data: string,
    userdataID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePilotDataMutationVariables = {
  input: UpdatePilotDataInput,
  condition?: ModelPilotDataConditionInput | null,
};

export type UpdatePilotDataMutation = {
  updatePilotData:  {
    __typename: "PilotData",
    id: string,
    data: string,
    userdataID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePilotDataMutationVariables = {
  input: DeletePilotDataInput,
  condition?: ModelPilotDataConditionInput | null,
};

export type DeletePilotDataMutation = {
  deletePilotData:  {
    __typename: "PilotData",
    id: string,
    data: string,
    userdataID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserDataMutationVariables = {
  input: CreateUserDataInput,
  condition?: ModelUserDataConditionInput | null,
};

export type CreateUserDataMutation = {
  createUserData:  {
    __typename: "UserData",
    id: string,
    achievements: Array< string | null > | null,
    selectorView: string | null,
    npcView: string | null,
    rosterView: string | null,
    hangarView: string | null,
    pilotSheetView: string | null,
    theme: string | null,
    welcome_hash: string | null,
    PilotData:  {
      __typename: "ModelPilotDataConnection",
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserDataMutationVariables = {
  input: UpdateUserDataInput,
  condition?: ModelUserDataConditionInput | null,
};

export type UpdateUserDataMutation = {
  updateUserData:  {
    __typename: "UserData",
    id: string,
    achievements: Array< string | null > | null,
    selectorView: string | null,
    npcView: string | null,
    rosterView: string | null,
    hangarView: string | null,
    pilotSheetView: string | null,
    theme: string | null,
    welcome_hash: string | null,
    PilotData:  {
      __typename: "ModelPilotDataConnection",
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserDataMutationVariables = {
  input: DeleteUserDataInput,
  condition?: ModelUserDataConditionInput | null,
};

export type DeleteUserDataMutation = {
  deleteUserData:  {
    __typename: "UserData",
    id: string,
    achievements: Array< string | null > | null,
    selectorView: string | null,
    npcView: string | null,
    rosterView: string | null,
    hangarView: string | null,
    pilotSheetView: string | null,
    theme: string | null,
    welcome_hash: string | null,
    PilotData:  {
      __typename: "ModelPilotDataConnection",
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetPilotDataQueryVariables = {
  id: string,
};

export type GetPilotDataQuery = {
  getPilotData:  {
    __typename: "PilotData",
    id: string,
    data: string,
    userdataID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPilotDatasQueryVariables = {
  filter?: ModelPilotDataFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPilotDatasQuery = {
  listPilotDatas:  {
    __typename: "ModelPilotDataConnection",
    items:  Array< {
      __typename: "PilotData",
      id: string,
      data: string,
      userdataID: string,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetUserDataQueryVariables = {
  id: string,
};

export type GetUserDataQuery = {
  getUserData:  {
    __typename: "UserData",
    id: string,
    achievements: Array< string | null > | null,
    selectorView: string | null,
    npcView: string | null,
    rosterView: string | null,
    hangarView: string | null,
    pilotSheetView: string | null,
    theme: string | null,
    welcome_hash: string | null,
    PilotData:  {
      __typename: "ModelPilotDataConnection",
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUserDatasQueryVariables = {
  filter?: ModelUserDataFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserDatasQuery = {
  listUserDatas:  {
    __typename: "ModelUserDataConnection",
    items:  Array< {
      __typename: "UserData",
      id: string,
      achievements: Array< string | null > | null,
      selectorView: string | null,
      npcView: string | null,
      rosterView: string | null,
      hangarView: string | null,
      pilotSheetView: string | null,
      theme: string | null,
      welcome_hash: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreatePilotDataSubscription = {
  onCreatePilotData:  {
    __typename: "PilotData",
    id: string,
    data: string,
    userdataID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePilotDataSubscription = {
  onUpdatePilotData:  {
    __typename: "PilotData",
    id: string,
    data: string,
    userdataID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePilotDataSubscription = {
  onDeletePilotData:  {
    __typename: "PilotData",
    id: string,
    data: string,
    userdataID: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserDataSubscription = {
  onCreateUserData:  {
    __typename: "UserData",
    id: string,
    achievements: Array< string | null > | null,
    selectorView: string | null,
    npcView: string | null,
    rosterView: string | null,
    hangarView: string | null,
    pilotSheetView: string | null,
    theme: string | null,
    welcome_hash: string | null,
    PilotData:  {
      __typename: "ModelPilotDataConnection",
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserDataSubscription = {
  onUpdateUserData:  {
    __typename: "UserData",
    id: string,
    achievements: Array< string | null > | null,
    selectorView: string | null,
    npcView: string | null,
    rosterView: string | null,
    hangarView: string | null,
    pilotSheetView: string | null,
    theme: string | null,
    welcome_hash: string | null,
    PilotData:  {
      __typename: "ModelPilotDataConnection",
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserDataSubscription = {
  onDeleteUserData:  {
    __typename: "UserData",
    id: string,
    achievements: Array< string | null > | null,
    selectorView: string | null,
    npcView: string | null,
    rosterView: string | null,
    hangarView: string | null,
    pilotSheetView: string | null,
    theme: string | null,
    welcome_hash: string | null,
    PilotData:  {
      __typename: "ModelPilotDataConnection",
      nextToken: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
