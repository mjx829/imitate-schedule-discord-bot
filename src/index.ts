import { log } from "@/utils/logger";
import { initDoc, fetchSheet, fetchDateColumnsRange, fetchCellsFromRange } from "@/spreadsheet";

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

        const doc = await initDoc();
        const sheet = await fetchSheet(doc, "2026");

        const cellsRange = await fetchDateColumnsRange(sheet, "A:A", "3/2");
        console.log(cellsRange);
        const cells = await fetchCellsFromRange(sheet, cellsRange.offset, cellsRange.range);

        console.log(cells);

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
