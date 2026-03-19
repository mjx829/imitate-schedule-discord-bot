import "dotenv/config";
import { log } from "@/utils/logger";

const requireEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) throw new Error(`env ${key} was not defined.`);

    log.write("DEBUG", `env ${key.charAt(0)}... was loaded.`);
    return String(value);
}

export const CONFIG = {
    GOOGLE_SERVICE_ACCOUNT: {
        EMAIL: requireEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
        KEY: requireEnv("GOOGLE_SERVICE_ACCOUNT_KEY").replace(/\\n/g, '\n'),
    },
    SPERADSHEET: {
        SHEET_ID: requireEnv("SPREADSHEET_SHEET_ID"),
    },
    YOUTUBE: {
        KEY: requireEnv("YOUTUBE_DATA_API_KEY"),
        URL: '',
    },
    DISCORD: {
        WEBHOOK_URL: requireEnv("DISCORD_WEBHOOK_URL"),
    }
}
