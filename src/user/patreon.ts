const lcp_meta_key = import.meta.env.VITE_LCP_META_KEY;

// garbage api. awful api. terrible api. bad api. no good. no good at all. this is a dog's api.
const cleanData = (data: any) => {
  const { full_name, thumb_url } = data.data.attributes;
  const membership = data.included.find((i: any) => i.type === 'member');
  const tiers = data.included.filter((i: any) => i.type === 'tier');
  const currently_entitled_tier = tiers.find(
    (t: any) => t.id === membership.relationships.currently_entitled_tiers.data[0].id
  );
  const { patron_status, currently_entitled_amount_cents, is_follower } = membership.attributes;
  const tierData = currently_entitled_tier.attributes;

  return {
    full_name,
    thumb_url,
    patron_status,
    currently_entitled_amount_cents,
    is_follower,
    tierData,
  };
};

const authPatreon = async (code: string) => {
  console.log(import.meta.env.VITE_APP_PATREON_CALLBACK_URI);

  const response = await fetch(`${import.meta.env.VITE_APP_OAUTH_API}/patreon/callback/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      redirect_uri: import.meta.env.VITE_APP_PATREON_CALLBACK_URI,
    }),
  });

  const data = await response.json();
  return data;
};

const getPatronProfile = async (access_token: string) => {
  const url = `${import.meta.env.VITE_APP_OAUTH_API}/patreon/proxy?access_token=${access_token}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'x-api-key': lcp_meta_key },
  });
  const json = await response.json();
  console.log('Response JSON:', json);

  if (json.errors) {
    throw new Error(json.errors[0]);
  }

  return cleanData(json);
};

export { authPatreon, getPatronProfile };
