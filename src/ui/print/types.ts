type PrintOption = {
  key: string
  title: string
  icon?: string
}

type PrintOptionsBaseShape = {
  layout: PrintOption
  orientation: PrintOption
  paper: PrintOption
  include: PrintOption[]
  extras: PrintOption[]
}

type PilotPrintOptions = {
  layout: PrintOption
  orientation: PrintOption
  paper: PrintOption
  content: PrintOption
  bonds: PrintOption
  pilotInclude: PrintOption[]
  mechInclude: PrintOption[]
  extras: PrintOption[]
  card: PrintOption[]
}

type GmPrintOptions = PrintOptionsBaseShape

export type { PrintOption, PrintOptionsBaseShape, PilotPrintOptions, GmPrintOptions }
