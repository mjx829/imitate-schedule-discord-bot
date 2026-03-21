import { log } from "@/utils/logger";
import { fetchCellsFromDate } from "@/spreadsheet";
import { applyFilters, hasValidUrl, notInAuthorDenyList, inCategoryAllowList } from "@/filter";
import { fetchVideoFromIds, fetchChannelIconsFromIds } from "@/youtube";

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
        const cells = await fetchCellsFromDate(new Date(2026, 2, 2));
        const filteredCell = applyFilters(
            cells,
            hasValidUrl(youtubeUrl),
            inCategoryAllowList(categoryList),
        );

        const ids = ["U80I6Wiygd8", "r7qBZ-KFUJw", "R-z-UGziThQ"];

        const videoInfo = await fetchVideoFromIds(ids);
        const channelIcon = await fetchChannelIconsFromIds(videoInfo.map(v => v.channelId));

        console.log(channelIcon);

        console.log(filteredCell);

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
