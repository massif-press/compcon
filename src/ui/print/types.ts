type PrintOption = {
  title: string
  icon: string
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

type GmPrintOptions = {
  layout: PrintOption
  orientation: PrintOption
  paper: PrintOption
  include: PrintOption[]
  extras: PrintOption[]
  card: PrintOption[]
}

export type { PrintOption, PilotPrintOptions, GmPrintOptions }
