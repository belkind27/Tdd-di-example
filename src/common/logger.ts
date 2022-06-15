import { inject, injectable } from "tsyringe";

export interface loggerOptions {
  isActive: boolean;
}

export const LOGGER_Symbol = Symbol("Logger");
export const LOGGER_OPTIONS = Symbol("LOGGER_OPTIONS");

@injectable()
export class Logger {
  constructor(
    @inject(LOGGER_OPTIONS) private readonly options: loggerOptions
  ) {}
  public debug(msg: string): void {
    if (this.options.isActive) console.log(`[debug] ${msg}`);
  }
  public error(msg: string): void {
    if (this.options.isActive) console.log(`[error] ${msg}`);
  }
}
