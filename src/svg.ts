import { CardData } from "@/types";
import { toHHMM, toYYYYMMDD } from "@/utils/time";

const SVG_CONFIG = {
    WIDTH: 1000,
    BG_COLOR: "#000",
    BORDER: {
        PADDING_TOP: 20,
        PADDING: 30,
        COLOR: "#fff",
        WEIGHT: 5,
    },
    TITLE: {
        FG: {
            X: 500,
            Y: 64,
            FONT_SIZE: 36,
            FONT_FAMILY: "Noto Sans JP",
            FONT_WEIGHT: 800,
            COLOR: "#fff",
            ANCHOR: "middle",
        },
        BG: {
            X: 300, Y: 25,
            WIDTH: 400,
            HEIGHT: 50,
            COLOR: "#000",
        },
    },
    CARD: {
        PADDING_TOP: 130,
        PADDING_LEFT: 60,
        HEIGHT: 120,
        IMAGE: {
            HEIGHT: 70,
            WIGHT: 70,
            PADDING_TOP: 10,
        },
        TIME: {
            PADDING_BOTTOM: 10,
            FONT_SIZE: 30,
            FONT_FAMILY: "Noto Sans JP",
            FONT_WEIGHT: 700,
            COLOR: "#fff",
        },
        TITLE: {
            PADDING_TOP: 34,
            PADDING_LEFT: 15,
            FONT_SIZE: 32,
            FONT_FAMILY: "Noto Sans JP",
            FONT_WEIGHT: 900,
            COLOR: "#fff",
            MAX_CHAR_COUNT: 24,
        },
        AUTHOR: {
            PADDING_TOP: 63,
            PADDING_LEFT: 15,
            FONT_SIZE: 22,
            FONT_FAMILY: "Noto Sans JP",
            FONT_WEIGHT: 700,
            COLOR: "#fff",
        },
    },
}

const toBase64 = async (url: string): Promise<string> => {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/jpeg;base64,${base64}`;
}

const genTextSvg = (
    text: string,
    x: number,
    y: number,
    fontSize: number,
    fontWeight: number = 500,
    anchor: string = "start",
    fill: string = "#ffffff",
    fontFamily: string = "Noto Sans JP"
): string =>
    `<text x="${x}" y="${y}" font-size="${fontSize}" fill="${fill}" font-family="${fontFamily}" font-weight="${fontWeight}" text-anchor="${anchor}">${text}</text>`;

const genScheduleTitleElement = (title: string): string =>`
    <rect
        x="${SVG_CONFIG.TITLE.BG.X}"
        y="${SVG_CONFIG.TITLE.BG.Y}"
        width="${SVG_CONFIG.TITLE.BG.WIDTH}"
        height="${SVG_CONFIG.TITLE.BG.HEIGHT}"
        fill="${SVG_CONFIG.TITLE.BG.COLOR}"
    />
    ${genTextSvg(
        title,
        SVG_CONFIG.TITLE.FG.X,
        SVG_CONFIG.TITLE.FG.Y,
        SVG_CONFIG.TITLE.FG.FONT_SIZE,
        SVG_CONFIG.TITLE.FG.FONT_WEIGHT,
        SVG_CONFIG.TITLE.FG.ANCHOR,
        SVG_CONFIG.TITLE.FG.COLOR,
    )}
`;

const trimCardTitle = (title: string): string => {
    if (!title.substring(SVG_CONFIG.CARD.TITLE.MAX_CHAR_COUNT)) return title;
    return `${title.substring(SVG_CONFIG.CARD.TITLE.MAX_CHAR_COUNT - 1)}...`;
};

const genCardElements = async (cards: CardData[], paddingTop: number = 0): Promise<string> => {
    if (cards.length === 0) return genTextSvg(
        "予約されている動画公開は見つかりませんでした。",
        SVG_CONFIG.WIDTH / 2,
        SVG_CONFIG.CARD.HEIGHT / 2 + SVG_CONFIG.CARD.PADDING_TOP,
        26,
        300,
        "middle",
    );
    let svg = "";

    const pT = paddingTop;
    const pL = SVG_CONFIG.CARD.PADDING_LEFT;
    const cH = SVG_CONFIG.CARD.HEIGHT;
    const iW = SVG_CONFIG.CARD.IMAGE.WIGHT;
    const iH = SVG_CONFIG.CARD.IMAGE.HEIGHT;

    for (let i = 0; i < cards.length; i++) {
        const data = cards[i];
        const time = toHHMM(data.date);
        const iconSource = data.iconUrl;
        let iconUrl = "";
        if (iconSource) iconUrl = await toBase64(iconSource);
        const card = `
            <!-- time -->
            ${genTextSvg(
                time,
                pL,
                pT - SVG_CONFIG.CARD.TIME.PADDING_BOTTOM + cH * i,
                SVG_CONFIG.CARD.TIME.FONT_SIZE,
                SVG_CONFIG.CARD.TIME.FONT_WEIGHT,
            )}
            <!-- title -->
            ${genTextSvg(
                trimCardTitle(data.title),
                pL + iW + SVG_CONFIG.CARD.TITLE.PADDING_LEFT,
                pT + SVG_CONFIG.CARD.TITLE.PADDING_TOP + cH * i,
                SVG_CONFIG.CARD.TITLE.FONT_SIZE,
                SVG_CONFIG.CARD.TITLE.FONT_WEIGHT,
            )}
            <!-- author -->
            ${genTextSvg(
                data.author,
                pL + iW + SVG_CONFIG.CARD.AUTHOR.PADDING_LEFT,
                pT + SVG_CONFIG.CARD.AUTHOR.PADDING_TOP + cH * i,
                SVG_CONFIG.CARD.AUTHOR.FONT_SIZE,
                SVG_CONFIG.CARD.AUTHOR.FONT_WEIGHT,
            )}
            <!-- icon -->
            <defs>
                <clipPath id="image${i}">
                    <rect x="${pL}" y="${pT + i * cH}" width="${iW}" height="${iH}" rx="${iH / 2}"/>
                </clipPath>
            </defs>
            <image x="${pL}" y="${pT + i * cH}" width="${iW}" height="${iH}" clip-path="url(#image${i})" href="${iconUrl}"/>
        `;

        svg += card;
    }

    return svg;
}

const genScheduleSvg = (elements: string, height: number): string =>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${SVG_CONFIG.WIDTH}" height="${height}">
        <rect width="${SVG_CONFIG.WIDTH}" height="${height}" fill="${SVG_CONFIG.BG_COLOR}"/>
        <rect
            x="${SVG_CONFIG.BORDER.PADDING}"
            y="${SVG_CONFIG.BORDER.PADDING + SVG_CONFIG.BORDER.PADDING_TOP}"
            width="${SVG_CONFIG.WIDTH - 2 * SVG_CONFIG.BORDER.PADDING}"
            height="${height - (SVG_CONFIG.BORDER.PADDING * 2) - SVG_CONFIG.BORDER.PADDING_TOP}"
            stroke="${SVG_CONFIG.BORDER.COLOR}" 
            stroke-width="${SVG_CONFIG.BORDER.WEIGHT}"
            fill="none"
        />

        ${elements}
    </svg>
`;

export const genSchedule = async (date: Date, cards: CardData[]): Promise<string> => {
    const content = `
        ${genScheduleTitleElement(`${toYYYYMMDD(date)}の予定`)}
        ${await genCardElements(cards, SVG_CONFIG.CARD.PADDING_TOP)}
    `;
    const cardsCount = cards.length || 1;
    const height = SVG_CONFIG.CARD.PADDING_TOP + SVG_CONFIG.BORDER.PADDING + (cardsCount * SVG_CONFIG.CARD.HEIGHT);
    return genScheduleSvg(content, height);
}
