// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { EXTRA_CONTENT_API_BASE_URL } from '@/config/api'

const lcp_meta_key = import.meta.env.VITE_LCP_META_KEY || ''

const scan = async () => {
  const response = await fetch(`${EXTRA_CONTENT_API_BASE_URL}/scan`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': lcp_meta_key,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export { scan }
