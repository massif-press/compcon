import { ItemType } from '../enums'
import {
  CloudController,
  ICloudData,
  ICloudSyncable,
  ISaveData,
  ISaveable,
  SaveController,
} from '../components'
import { readStream } from '../components/combat/log/events'
import { reduceEvents, mergeRollups, blankRollup } from '../components/combat/log/telemetry'
import { planImport, applyImport, candidateOf } from '../components/combat/log/stream'
import type { ILogStream, IActorRef, LogSource } from '../components/combat/log/events'
import type { IEncounterRollup } from '../components/combat/log/telemetry'
import type { IReconcileCandidate } from '../components/combat/log/stream'

// rollups are kept forever, encounter logs are capped at 50 (which no pilot should ever really hit)
const STREAM_RETENTION = 50

interface IEncounterRecord {
  encounterId: string
  encounterName: string
  campaignId?: string
  missionId?: string
  start: number
  end?: number
  rounds: number
  result?: string
  source: LogSource
  participants: IActorRef[]
  rollup: IEncounterRollup
}

interface IPilotLogbookData {
  itemType: 'PilotLogbook'
  id: string
  pilotId: string
  records: IEncounterRecord[]
  streams: ILogStream[]
  save: ISaveData
  cloud: ICloudData
}

function recordFrom(stream: ILogStream, actorId: string): IEncounterRecord {
  return {
    encounterId: stream.encounterId,
    encounterName: stream.encounterName,
    campaignId: stream.campaignId,
    missionId: stream.missionId,
    start: stream.start,
    end: stream.end,
    rounds: stream.rounds,
    result: stream.result,
    source: stream.source,
    participants: stream.participants,
    rollup: reduceEvents(stream.events, actorId),
  }
}

class PilotLogbook implements ISaveable, ICloudSyncable {
  public readonly ID: string
  public readonly ItemType: ItemType = ItemType.PilotLogbook
  public readonly DataType: string = 'savedata'
  public readonly StorageType: string = 'pilot_logbooks'
  public readonly PilotID: string

  public Records: IEncounterRecord[] = []
  public Streams: ILogStream[] = []

  public SaveController: SaveController
  public CloudController: CloudController

  constructor(data: Partial<IPilotLogbookData> & { pilotId: string }) {
    this.ID = data.id ?? crypto.randomUUID()
    this.PilotID = data.pilotId
    this.Records = data.records ?? []
    this.Streams = (data.streams ?? []).map(readStream).filter(Boolean) as ILogStream[]

    this.SaveController = new SaveController(this)
    this.CloudController = new CloudController(this)
  }

  public get Name(): string {
    return `${this.PilotID} logbook`
  }

  public get Lifetime(): IEncounterRollup {
    if (!this.Records.length) return blankRollup()
    return mergeRollups(this.Records.map(r => r.rollup))
  }

  public get Encounters(): number {
    return this.Records.length
  }

  public Rollups(scope: { campaignId?: string; missionId?: string } = {}): IEncounterRollup {
    const matching = this.Records.filter(
      r =>
        (!scope.campaignId || r.campaignId === scope.campaignId) &&
        (!scope.missionId || r.missionId === scope.missionId)
    )
    return matching.length ? mergeRollups(matching.map(r => r.rollup)) : blankRollup()
  }

  public StreamFor(encounterId: string): ILogStream | undefined {
    return this.Streams.find(s => s.encounterId === encounterId)
  }

  public RecordFor(encounterId: string): IEncounterRecord | undefined {
    return this.Records.find(r => r.encounterId === encounterId)
  }

  public PlanImport(incoming: ILogStream): {
    action: 'replace' | 'add'
    targetIndex: number
    suggestions: number[]
    candidate: IReconcileCandidate
  } {
    return { ...planImport(incoming, this.Records), candidate: candidateOf(incoming) }
  }

  public Import(incoming: ILogStream, actorId: string, replaceIndex = -1): void {
    const replacedId =
      replaceIndex >= 0 && replaceIndex < this.Records.length
        ? this.Records[replaceIndex].encounterId
        : undefined

    this.Streams = applyImport(incoming, this.Streams, replacedId)
    this.Records = this.Records.filter(
      r => r.encounterId !== replacedId && r.encounterId !== incoming.encounterId
    )
    this.Records.push(recordFrom(incoming, actorId))

    this.Trim()
    this.SaveController.LastModified = Date.now()
  }

  public Remove(encounterId: string): void {
    this.Records = this.Records.filter(r => r.encounterId !== encounterId)
    this.Streams = this.Streams.filter(s => s.encounterId !== encounterId)
    this.SaveController.LastModified = Date.now()
  }

  public Trim(retention = STREAM_RETENTION): void {
    this.Records.sort((a, b) => a.start - b.start)
    if (this.Streams.length <= retention) return
    const keep = new Set(
      [...this.Streams]
        .sort((a, b) => b.start - a.start)
        .slice(0, retention)
        .map(s => s.encounterId)
    )
    this.Streams = this.Streams.filter(s => keep.has(s.encounterId))
  }

  public static Serialize(logbook: PilotLogbook): IPilotLogbookData {
    const data = {
      itemType: 'PilotLogbook',
      id: logbook.ID,
      pilotId: logbook.PilotID,
      records: logbook.Records,
      streams: logbook.Streams,
    } as IPilotLogbookData

    SaveController.Serialize(logbook, data)
    CloudController.Serialize(logbook, data)
    return data
  }

  public Serialize(): IPilotLogbookData {
    return PilotLogbook.Serialize(this)
  }

  public static Deserialize(data: IPilotLogbookData): PilotLogbook {
    const logbook = new PilotLogbook(data)
    SaveController.Deserialize(logbook, data.save)
    CloudController.Deserialize(logbook, data.cloud)
    return logbook
  }

  public Clone(): PilotLogbook {
    return PilotLogbook.Deserialize(JSON.parse(JSON.stringify(this.Serialize())))
  }
}

export { PilotLogbook, recordFrom, STREAM_RETENTION }
export type { IPilotLogbookData, IEncounterRecord }
