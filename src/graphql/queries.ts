/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPilotData = /* GraphQL */ `
  query GetPilotData($id: ID!) {
    getPilotData(id: $id) {
      id
      data
      userdataID
      createdAt
      updatedAt
    }
  }
`;
export const listPilotDatas = /* GraphQL */ `
  query ListPilotDatas(
    $filter: ModelPilotDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPilotDatas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        data
        userdataID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUserData = /* GraphQL */ `
  query GetUserData($id: ID!) {
    getUserData(id: $id) {
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
export const listUserDatas = /* GraphQL */ `
  query ListUserDatas(
    $filter: ModelUserDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserDatas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        achievements
        selectorView
        npcView
        rosterView
        hangarView
        pilotSheetView
        theme
        welcome_hash
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
