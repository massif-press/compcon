const scan = async () => {
  const response = await fetch(`${import.meta.env.VITE_APP_INVOKE_URL}/scan`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': import.meta.env.VITE_APP_API_KEY,
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export { scan }
