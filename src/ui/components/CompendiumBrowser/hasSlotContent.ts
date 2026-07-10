import { Comment, Fragment, Text, type Slot, type VNode } from 'vue'

function vnodeHasContent(v: VNode): boolean {
  if (v.type === Comment) return false
  if (v.type === Text) return String(v.children).trim() !== ''
  if (v.type === Fragment) return Array.isArray(v.children) && v.children.some((c) => vnodeHasContent(c as VNode))
  return true
}

export function hasSlotContent(slot?: Slot, props: Record<string, any> = {}): boolean {
  if (!slot) return false
  return slot(props).some(vnodeHasContent)
}
