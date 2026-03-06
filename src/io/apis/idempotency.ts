// only when provided as an as an `Idempotency-Key` header on POST/DELETE requests:
// first request executes normally, response is cached in DynamoDB (24h TTL)
// duplicate requests with the same key return the cached response
// prevents double-writes on retry

export const IDEMPOTENCY_HEADER = 'Idempotency-Key'

export function generateIdempotencyKey(): string {
  return crypto.randomUUID()
}

export function generateDeterministicKey(
  userId: string,
  scope: string,
  timestamp?: number
): string {
  return `${userId}-${scope}-${timestamp || Date.now()}`
}
