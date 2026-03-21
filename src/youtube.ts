import { CONFIG } from "@/const";
import { log } from "@/utils/logger";
import { Cell, YoutubeVideoItem, YoutubeChannelItem, VideoInfo, ChannelIcon } from "@/types";

export const fetchVideoFromIds = async (ids: string[]): Promise<VideoInfo[]> => {
    if (!ids) return [];

    let videoInfo: VideoInfo[] = [];

    for (let i = 0; i < ids.length; i += 50) {
        const chunk = ids.slice(i, i + 50);
        const url = `${CONFIG.YOUTUBE.BASE_URL}videos?id=${chunk.join(",")}&part=snippet,liveStreamingDetails&key=${CONFIG.YOUTUBE.KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        log.write("DEBUG", `${data.items.length} videos info were fetched from youtube.`);

        videoInfo.push(...data.items.map((item: YoutubeVideoItem): VideoInfo => ({
            id: item.id,
            title: item.snippet.title,
            channelId: item.snippet.channelId,
            channelTitle: item.snippet.channelTitle,
            publishedAt: new Date(item.liveStreamingDetails?.scheduledStartTime || item.snippet.publishedAt),
        })));

    }

   return videoInfo;
}


export const fetchChannelIconsFromIds = async (ids: string[]): Promise<ChannelIcon[]> => {
    let channelIcons: ChannelIcon[] = [];

    const uniqueIds = [...new Set(ids)];

    for (let i = 0; i < uniqueIds.length; i += 50) {
        const chunk = uniqueIds.slice(i, i + 50);
        const url = `${CONFIG.YOUTUBE.BASE_URL}channels?id=${chunk.join(",")}&part=snippet&key=${CONFIG.YOUTUBE.KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        channelIcons.push(...data.items.map((item: YoutubeChannelItem): ChannelIcon => ({
            channelId: item.id,
            iconUrl: item.snippet.thumbnails.high.url,
        })));
    }

    return channelIcons;
}
