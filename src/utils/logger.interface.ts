export type LogLevels = "DEBUG" | "INFO" | "WARN" | "ERROR";

export interface Logger {
    write(level: LogLevels, message: string): void;
}
