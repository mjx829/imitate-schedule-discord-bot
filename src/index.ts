import { log } from "@/utils/logger";
import { fetchCellsFromDate } from "@/spreadsheet";
import { applyFilters, hasValidUrl, inCategoryAllowList } from "@/filter";
import { fetchCellsInfoFromYt } from "@/aggregate";
import { genSchedule } from "@/svg";
import { sendWebhook } from "@/webhook";
import sharp from "sharp";

process.on("uncaughtException", (e) => {
    log.write("ERROR", `uncaught exception. (${(e as Error).message})(${(e as Error).stack})`);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    const message = reason instanceof Error ? reason.message : String(reason);
    const stack = reason instanceof Error ? reason.stack : "";
    log.write("ERROR", `unhandled rejection. (${message})(${stack})`);
    process.exit(1);
});

async function main(): Promise<void> {
    try {
        log.write("INFO", "starting...");

        const categoryList = ["曲", "アレンジ", "予告"];
        const youtubeUrl = /^https?:\/\/(www\.youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;

        // new Date(new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }))
        const date = new Date(2026, 0, 24);
        const cells = await fetchCellsFromDate(date);
        const filteredCell = applyFilters(
            cells,
            hasValidUrl(youtubeUrl),
            inCategoryAllowList(categoryList),
        );

        const cards = await fetchCellsInfoFromYt(filteredCell);
        const svg = await genSchedule(date, cards);
        const buffer = await sharp(Buffer.from(svg)).png().toBuffer();

        await sendWebhook(buffer);

        process.on("SIGTERM", () => { 
            process.exit(0);
        });
        process.on("SIGINT", () => { 
            process.exit(0);
        });
    } catch (e) {
        log.write("ERROR", `failed to start. (${(e as Error).message})(${(e as Error).stack})`);
        process.exit(1);
    }
}

main();
