import { Logger, LogLevels } from "./logger.interface";

class LogConsole implements Logger {
    private readonly timeOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    };

    write (level: LogLevels, message: string): void {
        const formatedMassage = this.formatMessage(message, level);

        switch (level) {
            case "WARN":
                console.warn(formatedMassage);
                break;
            case "ERROR":
                console.error(formatedMassage);
                break;
            default:
                console.log(formatedMassage);
                break;
        }
    }

    private formatMessage(message: string, level: LogLevels): string {
        const timestamp = this.formatTimestamp();
        return `[${timestamp}][${level.toString().padEnd(5, " ")}] ${message}`;
    }

    private formatTimestamp(): string {
        return Intl.DateTimeFormat("ja-JP", this.timeOptions).format(new Date).toString();
    }
}

export const log: Logger = new LogConsole();
