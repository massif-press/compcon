import { ActivationType } from '@/class'

interface InvasionOption {
  name: string
  detail: string
}

interface IAction {
  name: string
  activation: ActivationType
  init?: string
  frequency?: string
  trigger?: string
  options?: InvasionOption[]
  detail: string
}

export { IAction }
