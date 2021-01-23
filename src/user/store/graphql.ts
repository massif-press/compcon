export const getUser = /* GraphQL */ `
  query getUser($uid: String!) {
    listUserDatas(filter: { user_id: { eq: $uid } }) {
      items {
        id
        lcp_data
        missions
        npcs
        pilots
        theme
        updatedAt
        user_id
        welcome_hash
        encounters
        achievements
        active_missions
        createdAt
        sync_options
        sync_frequency
        view_options
        _lastChangedAt
        _version
      }
    }
  }
`
