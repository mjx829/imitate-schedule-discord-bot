import { CONFIG } from "@/const";
import { log } from "@/utils/logger";

export const sendWebhook = async (imageBuffer: Buffer): Promise<void> => {
    const formData = new FormData();
    formData.append('files[0]', new Blob([new Uint8Array(imageBuffer)], { type: 'image/png' }), 'card.png');

    const res = await fetch(CONFIG.DISCORD.WEBHOOK_URL, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) throw new Error(`discord webhook was failed. (${res.status})`);
}
