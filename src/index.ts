import { log } from "@/utils/logger";

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

function main(): void {
    try {
        log.write("INFO", "starting...");

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
