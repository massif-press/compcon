// garbage api. awful api. terrible api. bad api. no good. no good at all. this is a dog's api.
const cleanPatreonData = (data: any) => {
  const { full_name, thumb_url } = data?.data?.attributes ?? {}
  const membership = data?.included?.find((i: any) => i.type === 'member')
  const tiers = data?.included?.filter((i: any) => i.type === 'tier') ?? []
  const entitledTierId = membership?.relationships?.currently_entitled_tiers?.data?.[0]?.id
  const currently_entitled_tier = tiers.find((t: any) => t.id === entitledTierId)
  const { patron_status, currently_entitled_amount_cents, is_follower } = membership?.attributes ?? {}
  const tierData = currently_entitled_tier?.attributes

  return {
    full_name,
    thumb_url,
    patron_status,
    currently_entitled_amount_cents,
    is_follower,
    tierData,
  }
}

const authPatreon = async (code: string) => {
  const response = await fetch(`${import.meta.env.VITE_APP_INVOKE_URL}/patreon-callback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': import.meta.env.VITE_APP_API_KEY },
    body: JSON.stringify({
      code,
      redirect_uri: import.meta.env.VITE_APP_OAUTH_CALLBACK_URI,
    }),
  })

  if (!response.ok) throw new Error(`Patreon callback failed: ${response.status}`)
  const data = await response.json()
  return data
}

const authItch = async (access_token: string) => {
  const response = await fetch(`${import.meta.env.VITE_APP_INVOKE_URL}/itch-callback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': import.meta.env.VITE_APP_API_KEY },
    body: JSON.stringify({
      access_token,
    }),
  })

  if (!response.ok) throw new Error(`Itch callback failed: ${response.status}`)
  const data = await response.json()
  return data
}

const getPatronProfile = async (access_token: string) => {
  const url = `${import.meta.env.VITE_APP_INVOKE_URL}/patreon/proxy`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_APP_API_KEY,
      'X-Patreon-Token': access_token,
    },
  })

  if (!response.ok) throw new Error(`Patreon profile fetch failed: ${response.status}`)
  const json = await response.json()

  if (json.errors) {
    throw new Error(json.errors[0])
  }

  return cleanPatreonData(json)
}

async function getPatreonSubscribers() {
  const url = `${import.meta.env.VITE_APP_INVOKE_URL}/${import.meta.env.VITE_APP_SUBSCRIBERS_ENDPOINT}`
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'x-api-key': import.meta.env.VITE_APP_API_KEY },
  })

  if (!response.ok) throw new Error(`Patreon subscribers fetch failed: ${response.status}`)
  const json = await response.json()

  if (json.errors) {
    throw new Error(json.errors[0])
  }

  return json
}

export { authPatreon, authItch, getPatronProfile, getPatreonSubscribers }
