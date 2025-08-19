export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  component: string;
  message: string;
  data?: any;
  correlationId?: string;
}

export class Logger {
  private component: string;
  private logLevel: LogLevel;
  private correlationId?: string;

  constructor(component: string, logLevel: LogLevel = LogLevel.INFO) {
    this.component = component;
    this.logLevel = this.getLogLevelFromEnv() || logLevel;
  }

  private getLogLevelFromEnv(): LogLevel | null {
    const envLevel = process.env.LOG_LEVEL?.toUpperCase();
    switch (envLevel) {
      case 'DEBUG':
        return LogLevel.DEBUG;
      case 'INFO':
        return LogLevel.INFO;
      case 'WARN':
        return LogLevel.WARN;
      case 'ERROR':
        return LogLevel.ERROR;
      default:
        return null;
    }
  }

  setCorrelationId(correlationId: string): void {
    this.correlationId = correlationId;
  }

  clearCorrelationId(): void {
    this.correlationId = undefined;
  }

  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data);
  }

  private log(level: LogLevel, message: string, data?: any): void {
    if (level < this.logLevel) {
      return;
    }

    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      component: this.component,
      message,
      data,
      correlationId: this.correlationId,
    };

    const formattedMessage = this.formatLogEntry(logEntry);
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
    }
  }

  private formatLogEntry(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const level = LogLevel[entry.level].padEnd(5);
    const correlationPart = entry.correlationId ? ` [${entry.correlationId}]` : '';
    
    let message = `${timestamp} ${level} [${entry.component}]${correlationPart} ${entry.message}`;
    
    if (entry.data !== undefined) {
      if (entry.data instanceof Error) {
        message += `\n  Error: ${entry.data.message}`;
        if (entry.data.stack) {
          message += `\n  Stack: ${entry.data.stack}`;
        }
      } else if (typeof entry.data === 'object') {
        try {
          message += `\n  Data: ${JSON.stringify(entry.data, null, 2)}`;
        } catch (error) {
          message += `\n  Data: [Circular or non-serializable object]`;
        }
      } else {
        message += `\n  Data: ${entry.data}`;
      }
    }

    return message;
  }

  createChild(childComponent: string): Logger {
    const childLogger = new Logger(`${this.component}:${childComponent}`, this.logLevel);
    if (this.correlationId) {
      childLogger.setCorrelationId(this.correlationId);
    }
    return childLogger;
  }
}

export class ErrorHandler {
  private logger: Logger;

  constructor(component: string) {
    this.logger = new Logger(`${component}:ErrorHandler`);
  }

  handleError(error: unknown, context: string, data?: any): Error {
    const processedError = this.processError(error);
    
    this.logger.error(`Error in ${context}:`, {
      message: processedError.message,
      stack: processedError.stack,
      context,
      data,
    });

    return processedError;
  }

  handleAsyncError(promise: Promise<any>, context: string): Promise<any> {
    return promise.catch((error) => {
      throw this.handleError(error, context);
    });
  }

  private processError(error: unknown): Error {
    if (error instanceof Error) {
      return error;
    }
    
    if (typeof error === 'string') {
      return new Error(error);
    }
    
    if (typeof error === 'object' && error !== null) {
      const message = (error as any).message || JSON.stringify(error);
      return new Error(message);
    }
    
    return new Error(`Unknown error: ${error}`);
  }
}

export function createPerformanceTimer(logger: Logger, operation: string) {
  const startTime = Date.now();
  
  return {
    end: (data?: any) => {
      const duration = Date.now() - startTime;
      logger.info(`Operation completed: ${operation}`, {
        duration: `${duration}ms`,
        ...data,
      });
    },
  };
}