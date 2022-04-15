import uuid from 'uuid/v4'

interface IClockData {
  id?: string
  title?: string
  description?: string
  resolution?: string
  segments?: number
  progress?: number
  linear?: boolean
}

class Clock {
  public readonly ID: string
  public Title: string
  public Description: string
  public Resolution: string
  private segments: number
  public Progress: number
  public Linear: boolean
  public ItemType: string = 'Clock'

  public constructor(data?: IClockData) {
    this.ID = data?.id || uuid()
    this.segments = data?.segments || 6
    this.Progress = data?.progress || 0
    this.Title = data?.title || 'New Clock'
    this.Description = data?.description || ''
    this.Resolution = data?.resolution || ''
    this.Linear = data?.linear || false
  }

  public get Segments(): number {
    return this.segments
  }

  public set Segments(val: number) {
    if (isNaN(val)) return
    this.segments = val < 0 ? 0 : val
  }

  public Increment(): void {
    if (this.Progress < this.Segments) this.Progress++
  }

  public Decrement(): void {
    if (this.Progress > 0) this.Progress--
  }

  public static Serialize(c: Clock): IClockData {
    return {
      id: c.ID,
      title: c.Title,
      description: c.Description,
      resolution: c.Resolution,
      segments: c.Segments,
      progress: c.Progress,
    }
  }

  public static Deserialize(data: IClockData): Clock {
    return new Clock(data)
  }
}

export { IClockData, Clock }
