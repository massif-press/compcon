import * as Sentry from '@sentry/vue'
import type { App } from 'vue'

declare const APP_VERSION: string

enum LEVELS {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

const severityMap = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
}

const typeColors: Record<string, string> = {
  warn: '#F39C12',
  error: '#C0392B',
  debug: '#27AE60',
  info: '#2E86C1',
}

const STORAGE_KEY = 'cc_log_history'
const LEVEL_KEY = 'cc_log_level'
const MAX_HISTORY = 200 // entries kept per session
const MAX_SESSIONS = 10 // sessions retained across restarts
const REDACT_KEY =
  /pass(word|wd)?|secret|token|jwt|api[-_]?key|authorization|auth[-_]?token|credential|session[-_]?id|bearer/i

export interface IErrorReport {
  type: string
  color: string
  message: string
  trace: string
  caller: any
  callerName?: string
  errorName?: string
  errorMessage?: string
  timestamp: number
}

export interface ISession {
  id: string
  startedAt: number
  entries: IErrorReport[]
}

class Logger {
  private static instance: Logger
  private _level: LEVELS = LEVELS.WARN
  // _sessions is newest-first; _sessions[0] is the current (live) session.
  private _sessions: ISession[] = []
  private _current!: ISession
  private _saveTimer: ReturnType<typeof setTimeout> | null = null

  private constructor() {
    this._load()
  }

  public static getInstance(): Logger {
    if (!Logger.instance) Logger.instance = new Logger()
    return Logger.instance
  }

  // Entries of the current session (back-compat with existing callers).
  public get History(): IErrorReport[] {
    return this._current.entries
  }

  public get Sessions(): ISession[] {
    return this._sessions
  }

  public get level(): LEVELS {
    return this._level
  }

  public set level(level: LEVELS) {
    this._level = level
    try {
      localStorage.setItem(LEVEL_KEY, level)
    } catch {
      /* ignore quota/private-mode */
    }
  }

  public SafeStringify(obj: any): string {
    return JSON.stringify(obj, this._replacer(), 2)
  }

  // Deep, circular-safe, redacted plain-object snapshot. Drops Vue internals ($-keys)
  // and functions so we never persist live refs or secrets.
  private snapshot(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj
    try {
      return JSON.parse(JSON.stringify(obj, this._replacer(), 0))
    } catch {
      return '[Unserializable]'
    }
  }

  private _replacer() {
    const seen = new WeakSet()
    return (key: string, value: any) => {
      if (key.startsWith('$')) return undefined
      if (typeof value === 'function') return undefined
      if (key && REDACT_KEY.test(key)) return '[REDACTED]'
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return '[Circular]'
        seen.add(value)
      }
      return value
    }
  }

  // Pull the real error out of whichever slot a caller passed it in.
  private extractError(caller: any, err: any): Error | null {
    if (err instanceof Error) return err
    if (caller instanceof Error) return caller
    return null
  }

  public log(message: string, t?: string, caller?: any, err?: any): void {
    let type = (t || 'info').toLowerCase()
    if (!severityMap[type]) type = 'info'

    const error = this.extractError(caller, err)
    const entry: IErrorReport = {
      type,
      color: typeColors[type] || typeColors.info,
      message,
      trace: error?.stack || new Error().stack || 'Stack trace not available',
      caller: caller instanceof Error ? null : this.snapshot(caller),
      callerName: caller && !(caller instanceof Error) ? caller.constructor?.name : undefined,
      errorName: error?.name,
      errorMessage: error?.message,
      timestamp: Date.now(),
    }

    // Capture everything to the current session; console output is gated by the active level.
    // (Only error-level entries are persisted, see _persistSnapshot.)
    this._current.entries.push(entry)
    if (this._current.entries.length > MAX_HISTORY) this._current.entries.shift()
    this._scheduleSave()

    if (severityMap[type] < severityMap[this._level]) return

    console.log(
      `%cCOMP/CON%c${type.toUpperCase()}%c${message}`,
      'color: white; background-color:#991E2A; font-weight: bolder; font-size: 14px; padding: 2px 5px; border-radius: 3px;',
      `color: white; background-color:${entry.color}; font-weight: bolder;  margin-left: 6px; margin-right: 6px; padding: 2px 5px; border-radius: 3px;`,
      'background-color: RGBA(0,0,0,0.4); padding:2px; font-weight: bold;'
    )
    if (type === 'error' && error) console.error(error)
  }

  public error = (message: string, caller?: any, err?: any) => {
    this.log(message, 'error', caller, err)
    const error = this.extractError(caller, err)
    if (error) {
      Sentry.captureException(error, {
        tags: { caller: (caller && caller.constructor?.name) || 'unknown' },
        extra: { message },
      })
    }
  }
  public warn = (message: string, caller?: any) => this.log(message, 'warn', caller)
  public info = (message: string, caller?: any) => this.log(message, 'info', caller)
  public debug = (message: string, caller?: any) => this.log(message, 'debug', caller)

  // Human label for a session by its position in the newest-first list.
  public sessionLabel(index: number): string {
    if (index <= 0) return 'current session'
    if (index === 1) return 'last session'
    return `${index} sessions ago`
  }

  public clear(): void {
    this._current.entries = []
    this._scheduleSave()
  }

  // Export the given session, or all sessions when no id is passed.
  public export(sessionId?: string): string {
    const sessions = sessionId ? this._sessions.filter(s => s.id === sessionId) : this._sessions

    const ctx = [
      `COMP/CON Log for ${new Date().toLocaleString()}`,
      `Version: ${typeof APP_VERSION !== 'undefined' ? APP_VERSION : 'unknown'}`,
      `URL: ${typeof location !== 'undefined' ? location.href : 'n/a'}`,
      `User Agent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'n/a'}`,
      `Log Level: ${this._level}`,
      `Sessions: ${sessions.length}`,
      '============================================',
    ].join('\n')

    const body = sessions
      .map(session => {
        const idx = this._sessions.indexOf(session)
        const head = `[${this.sessionLabel(idx)}] started ${new Date(
          session.startedAt
        ).toLocaleString()} - ${session.entries.length} entries\n--------------------------------------------`
        const entries = session.entries
          .map(log => {
            const header = `${new Date(log.timestamp).toLocaleString()} - ${log.type.toUpperCase()} - ${log.message}`
            const errLine = log.errorName ? `${log.errorName}: ${log.errorMessage}` : ''
            const details = this.SafeStringify({ callerName: log.callerName, caller: log.caller })
            return [header, errLine, log.trace, details].filter(Boolean).join('\n')
          })
          .join('\n\n')
        return `${head}\n${entries}`
      })
      .join('\n\n\n')

    return `${ctx}\n\n${body}\n`
  }

  // Wire uncaught errors + rejections into the log so bugs get captured without a call site.
  public attachGlobalHandlers(app?: App): void {
    if (app) {
      // Sentry.init already installed an errorHandler; chain to it so it does the single
      // Sentry capture. We only add history + console here (log, not error).
      const prev = app.config.errorHandler
      app.config.errorHandler = (err, instance, info) => {
        this.log(`Vue error (${info}): ${err}`, 'error', instance, err)
        if (typeof prev === 'function') prev(err, instance, info)
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('error', e => {
        if (!e.error) return // resource-load errors (img/script) have no error object; skip noise
        this.log(`Uncaught: ${e.message}`, 'error', null, e.error)
      })
      window.addEventListener('unhandledrejection', e => {
        const reason = e.reason
        this.log(
          `Unhandled rejection: ${reason?.message || reason}`,
          'error',
          null,
          reason instanceof Error ? reason : null
        )
      })
    }
  }

  // Persisted form: all sessions, but only error-level entries are written to disk.
  private _persistSnapshot(): ISession[] {
    return this._sessions.map(s => ({
      id: s.id,
      startedAt: s.startedAt,
      entries: s.entries.filter(e => e.type === 'error'),
    }))
  }

  private _scheduleSave(): void {
    if (this._saveTimer) return
    this._saveTimer = setTimeout(() => {
      this._saveTimer = null
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this._persistSnapshot()))
      } catch {
        /* quota exceeded / private mode: keep in-memory only */
      }
    }, 500)
  }

  private _load(): void {
    let prior: ISession[] = []
    try {
      const level = localStorage.getItem(LEVEL_KEY)
      if (level && severityMap[level]) this._level = level as LEVELS
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          // Only persisted sessions carry entries (errors); drop empty ones so a run full of
          // clean reloads can't evict an older session that actually captured a crash.
          // Keep the most recent (MAX_SESSIONS - 1); the fresh current session takes the last slot.
          prior = parsed
            .filter(s => s && Array.isArray(s.entries) && s.entries.length)
            .slice(0, MAX_SESSIONS - 1)
        }
      }
    } catch {
      /* corrupt/unavailable storage: start fresh */
    }
    this._current = { id: `${Date.now()}`, startedAt: Date.now(), entries: [] }
    this._sessions = [this._current, ...prior]
  }
}

const logger = Logger.getInstance()

export default logger
export { LEVELS }
