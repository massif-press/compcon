// { "error": "NotFound", "message": "Item not found", "requestId": "xxxxxxx" }
export interface ApiErrorBody {
  error: string
  message: string
  requestId: string
  [key: string]: any
}

export async function parseApiError(response: Response): Promise<ApiErrorBody> {
  try {
    const body = await response.json()
    return {
      error: body.error || 'Unknown',
      message: body.message || response.statusText,
      requestId: body.requestId || '',
      ...body,
    }
  } catch {
    return {
      error: 'Unknown',
      message: response.statusText || `HTTP ${response.status}`,
      requestId: '',
    }
  }
}

export class NotFoundError extends Error {
  public readonly requestId: string
  constructor(message?: string, requestId?: string) {
    super(message || 'Resource not found')
    this.name = 'NotFoundError'
    this.requestId = requestId || ''
  }
}
