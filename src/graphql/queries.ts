/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUserData = /* GraphQL */ `
  query GetUserData($id: ID!) {
    getUserData(id: $id) {
      id
      user_id
      theme
      achievements
      lcp_data
      pilots
      npcs
      encounters
      missions
      active_missions
      welcome_hash
      sync_frequency
      sync_options
      view_options
      _version
      _deleted
      _lastChangedAt
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
        user_id
        theme
        achievements
        lcp_data
        pilots
        npcs
        encounters
        missions
        active_missions
        welcome_hash
        sync_frequency
        sync_options
        view_options
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncUserData = /* GraphQL */ `
  query SyncUserData(
    $filter: ModelUserDataFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUserData(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        user_id
        theme
        achievements
        lcp_data
        pilots
        npcs
        encounters
        missions
        active_missions
        welcome_hash
        sync_frequency
        sync_options
        view_options
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
