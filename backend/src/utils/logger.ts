import fs from 'fs';
import path from 'path';

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

export class Logger {
  private static instance: Logger;
  private logDirectory: string;

  private constructor() {
    this.logDirectory = path.join(process.cwd(), 'logs');
    this.ensureLogDirectory();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  private formatMessage(level: LogLevel, message: string, metadata?: any): string {
    const timestamp = new Date().toISOString();
    const metadataStr = metadata ? ` | ${JSON.stringify(metadata)}` : '';
    return `[${timestamp}] [${level}] ${message}${metadataStr}\n`;
  }

  private writeToFile(level: LogLevel, message: string): void {
    const date = new Date().toISOString().split('T')[0];
    const filename = `${date}.log`;
    const filepath = path.join(this.logDirectory, filename);
    
    try {
      fs.appendFileSync(filepath, message);
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  public log(level: LogLevel, message: string, metadata?: any): void {
    const formattedMessage = this.formatMessage(level, message, metadata);
    
    // Console output
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage.trim());
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage.trim());
        break;
      case LogLevel.INFO:
        console.info(formattedMessage.trim());
        break;
      case LogLevel.DEBUG:
        if (process.env.NODE_ENV === 'development') {
          console.debug(formattedMessage.trim());
        }
        break;
    }

    // File output
    this.writeToFile(level, formattedMessage);
  }

  public error(message: string, metadata?: any): void {
    this.log(LogLevel.ERROR, message, metadata);
  }

  public warn(message: string, metadata?: any): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  public info(message: string, metadata?: any): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  public debug(message: string, metadata?: any): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }
}