/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPilotData = /* GraphQL */ `
  mutation CreatePilotData(
    $input: CreatePilotDataInput!
    $condition: ModelPilotDataConditionInput
  ) {
    createPilotData(input: $input, condition: $condition) {
      id
      data
      userdataID
      createdAt
      updatedAt
    }
  }
`;
export const updatePilotData = /* GraphQL */ `
  mutation UpdatePilotData(
    $input: UpdatePilotDataInput!
    $condition: ModelPilotDataConditionInput
  ) {
    updatePilotData(input: $input, condition: $condition) {
      id
      data
      userdataID
      createdAt
      updatedAt
    }
  }
`;
export const deletePilotData = /* GraphQL */ `
  mutation DeletePilotData(
    $input: DeletePilotDataInput!
    $condition: ModelPilotDataConditionInput
  ) {
    deletePilotData(input: $input, condition: $condition) {
      id
      data
      userdataID
      createdAt
      updatedAt
    }
  }
`;
export const createUserData = /* GraphQL */ `
  mutation CreateUserData(
    $input: CreateUserDataInput!
    $condition: ModelUserDataConditionInput
  ) {
    createUserData(input: $input, condition: $condition) {
      id
      achievements
      selectorView
      npcView
      rosterView
      hangarView
      pilotSheetView
      theme
      welcome_hash
      PilotData {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateUserData = /* GraphQL */ `
  mutation UpdateUserData(
    $input: UpdateUserDataInput!
    $condition: ModelUserDataConditionInput
  ) {
    updateUserData(input: $input, condition: $condition) {
      id
      achievements
      selectorView
      npcView
      rosterView
      hangarView
      pilotSheetView
      theme
      welcome_hash
      PilotData {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteUserData = /* GraphQL */ `
  mutation DeleteUserData(
    $input: DeleteUserDataInput!
    $condition: ModelUserDataConditionInput
  ) {
    deleteUserData(input: $input, condition: $condition) {
      id
      achievements
      selectorView
      npcView
      rosterView
      hangarView
      pilotSheetView
      theme
      welcome_hash
      PilotData {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
