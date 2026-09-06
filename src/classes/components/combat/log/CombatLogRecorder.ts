import { makeEvent, readEvent } from './events'
import { buildStream } from './stream'
import { actorRef } from './refs'
import type {
  ILogEvent,
  ILogPayloads,
  ILogStream,
  LogEventKind,
  LogSource,
  IActorRef,
} from './events'

let openGroup: string | undefined

function withLogGroup<T>(fn: () => T, id?: string): T {
  if (openGroup) return fn()
  openGroup = id ?? crypto.randomUUID()
  try {
    return fn()
  } finally {
    openGroup = undefined
  }
}

interface IRecorderData {
  encounterId: string
  source: LogSource
  campaignId?: string
  missionId?: string
  seq: number
  events: unknown[]
}

class CombatLogRecorder {
  public RootActor: any
  public Events: ILogEvent[] = []
  public EncounterId = ''
  public CampaignId?: string
  public MissionId?: string
  public Source: LogSource = 'gm'
  public Side?: string

  private _seq = 0

  public constructor(rootActor: any, data?: IRecorderData) {
    this.RootActor = rootActor
    if (data) this.Load(data)
  }

  public get CombatController(): any {
    return this.RootActor?.CombatController
  }

  public get ActorId(): string {
    return this.RootActor?.ID ?? ''
  }

  public get Self(): IActorRef {
    return actorRef(this.CombatController, this.Side)
  }

  public Record<K extends LogEventKind>(kind: K, payload: ILogPayloads[K]): ILogEvent<K> {
    const cc = this.CombatController
    const event = makeEvent(kind, payload, {
      seq: this._seq++,
      source: this.Source,
      encounterId: this.EncounterId,
      campaignId: this.CampaignId,
      missionId: this.MissionId,
      round: cc?.Round ?? 0,
      turn: cc?.Turn ?? 0,
      actorId: this.ActorId,
      group: openGroup,
    })
    this.Events.push(event)
    return event
  }

  public Rollback(group?: string): number {
    if (!group) return 0
    const before = this.Events.length
    this.Events = this.Events.filter(e => e.group !== group)
    return before - this.Events.length
  }

  public Clear(): void {
    this.Events = []
    this._seq = 0
  }

  public Load(data: Partial<IRecorderData> | undefined): void {
    if (!data) return
    this.EncounterId = data.encounterId ?? ''
    this.Source = data.source === 'self' ? 'self' : 'gm'
    this.CampaignId = data.campaignId
    this.MissionId = data.missionId
    this.Events = (data.events ?? []).map(readEvent).filter(Boolean) as ILogEvent[]
    this._seq = this.Events.reduce((max, e) => Math.max(max, e.seq + 1), 0)
  }

  public Save(): IRecorderData {
    return {
      encounterId: this.EncounterId,
      source: this.Source,
      campaignId: this.CampaignId,
      missionId: this.MissionId,
      seq: this._seq,
      events: this.Events,
    }
  }

  public ToStream(header: Partial<ILogStream> = {}): ILogStream {
    return buildStream(
      {
        encounterId: this.EncounterId,
        campaignId: this.CampaignId,
        missionId: this.MissionId,
        ...header,
      },
      [this.Self],
      this.Events,
      this.Source
    )
  }
}

export { CombatLogRecorder, withLogGroup }
export type { IRecorderData }
