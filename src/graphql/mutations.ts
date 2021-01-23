/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUserData = /* GraphQL */ `
  mutation CreateUserData(
    $input: CreateUserDataInput!
    $condition: ModelUserDataConditionInput
  ) {
    createUserData(input: $input, condition: $condition) {
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
export const updateUserData = /* GraphQL */ `
  mutation UpdateUserData(
    $input: UpdateUserDataInput!
    $condition: ModelUserDataConditionInput
  ) {
    updateUserData(input: $input, condition: $condition) {
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
export const deleteUserData = /* GraphQL */ `
  mutation DeleteUserData(
    $input: DeleteUserDataInput!
    $condition: ModelUserDataConditionInput
  ) {
    deleteUserData(input: $input, condition: $condition) {
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
