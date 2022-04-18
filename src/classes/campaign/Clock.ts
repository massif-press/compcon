import uuid from 'uuid/v4'

interface IClockData {
  id: string,
  title: string,
  description: string,
  resolution: string
  segments: number,
  progress: number,
}

class Clock {
  public readonly ID: string
  public Title: string
  public Description: string
  public Resolution: string
  public Segments: number
  public Progress: number

  public constructor(data: IClockData) {
    this.ID = data?.id || uuid()
    this.Segments = data?.segments || 6
    this.Progress = data?.progress || 0
    this.Title = data?.title || ''
    this.Description = data?.description || ''
    this.Resolution = data?.resolution || ''
  }

  public Increment() {
    if (this.Progress < this.Segments) this.Progress++
  }

  public Decrement() {
    if (this.Progress > this.Segments) this.Progress--
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