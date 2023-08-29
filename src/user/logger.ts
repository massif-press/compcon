enum logLevel {
  debug,
  info,
  warn,
  error,
}

class Logger {
  private static instance: Logger;
  private constructor() {}

  private level: string = 'info';

  public History: {
    type: string;
    color: string;
    message: string;
    trace: any;
    caller: any;
    timestamp: number;
  }[] = [];

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    const level = localStorage.getItem('logLevel');
    if (level) Logger.instance.level = level;
    else localStorage.setItem('logLevel', 'info');

    return Logger.instance;
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

    this.History.push({
      type,
      color: typeColor,
      message,
      trace: this.getStackTrace(),
      caller,
      timestamp: Date.now(),
    });

    if (logLevel[type] < logLevel[this.level]) return;
    console.log(
      `%cCOMP/CON%c${type.toUpperCase()}%c${message}`,
      'color: white; background-color:#991E2A; font-weight: bolder; font-size: 14px; padding: 2px 5px; border-radius: 3px;',
      `color: white; background-color:${typeColor}; font-weight: bolder;  margin-left: 6px; margin-right: 6px; padding: 2px 5px; border-radius: 3px;`,
      'background-color: RGBA(0,0,0,0.4); padding:2px; font-weight: bold;'
    );
  }
}

const logger = Logger.getInstance();

export default logger;
