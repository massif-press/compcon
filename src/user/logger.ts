enum LEVELS {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

const severityMap = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private static instance: Logger;
  private _level = LEVELS.WARN;
  private constructor() {}

  private _history: {
    type: string;
    color: string;
    message: string;
    trace: any;
    caller: any;
    timestamp: number;
  }[] = [];

  public get History() {
    return this._history;
  }

  public get level() {
    return this._level;
  }

  public set level(level: LEVELS) {
    this._level = level;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public export(): string {
    let out = `COMP/CON Log for ${new Date(Date.now()).toLocaleString()}\n
    Log Level is ${this.level}
    \n--------------------------------------------\n`;

    const history = this._history.map((log) => {
      return `${new Date(log.timestamp).toLocaleString()} - ${log.type.toUpperCase()} - ${
        log.message
      }\nTRACE:\n${log.trace.join('\n')}\nCALLER:\n${JSON.stringify(
        log.caller || [],
        null,
        2
      )}\n\n`;
    });

    out += history;
    return out;
  }

  private getStackTrace() {
    let stack;

    try {
      throw new Error('');
    } catch (error: any) {
      stack = error.stack || '';
    }

    stack = stack.split('\n').map((line) => line.trim());

    // prune trace within logger
    stack = stack.splice(3);

    // prune chunked or inaccessible
    stack = stack.filter((line) => !line.includes('chunk') && !line.includes('vite'));

    // prune unnecessary content
    stack = stack.map((line) => line.replace(/https?:\/\/localhost(:\d{4})?/g, ''));
    stack = stack.map((line) => line.replace(/https?:\/\/[^\s\/]+\.app/g, ''));
    stack = stack.map((line) => line.split('?')[0]);

    return stack;
  }

  public log(message: string, t?: string, caller?: any): void {
    if (!t || !severityMap[t]) t = 'info';
    if (severityMap[t] < severityMap[this.level]) return;
    const type = t || 'info';
    let typeColor = '';

    switch (type) {
      case 'warn':
        typeColor = '#F39C12';
        break;
      case 'error':
        typeColor = '#C0392B';
        break;
      case 'debug':
        typeColor = '#27AE60';
        break;
      default:
        typeColor = '#2E86C1';
        break;
    }

    this._history.push({
      type,
      color: typeColor,
      message,
      trace: this.getStackTrace(),
      caller,
      timestamp: Date.now(),
    });

    if (t === 'debug') return;
    console.log(
      `%cCOMP/CON%c${type.toUpperCase()}%c${message}`,
      'color: white; background-color:#991E2A; font-weight: bolder; font-size: 14px; padding: 2px 5px; border-radius: 3px;',
      `color: white; background-color:${typeColor}; font-weight: bolder;  margin-left: 6px; margin-right: 6px; padding: 2px 5px; border-radius: 3px;`,
      'background-color: RGBA(0,0,0,0.4); padding:2px; font-weight: bold;'
    );
  }

  public error = (message: string, caller?: any) => this.log(message, 'error', caller);
  public warn = (message: string, caller?: any) => this.log(message, 'warn', caller);
  public info = (message: string, caller?: any) => this.log(message, 'info', caller);
}

const logger = Logger.getInstance();

export default logger;
