import { CONFIG } from "@/const";
import { log } from "@/utils/logger";
import { JWT } from "google-auth-library";

export const auth = (): JWT => {
    log.write("DEBUG", "auth will be created.");

    return new JWT({
        email: CONFIG.GOOGLE_SERVICE_ACCOUNT.EMAIL,
        key: CONFIG.GOOGLE_SERVICE_ACCOUNT.KEY,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
};
