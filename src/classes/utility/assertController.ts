export function assertController<T>(
  controller: T | undefined | null,
  name: string
): asserts controller is T {
  if (!controller)
    throw new Error(
      `${name} not found on parent. New ${name}s must be instantiated in the parent's constructor method.`
    )
}
