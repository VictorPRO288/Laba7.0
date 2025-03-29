// src/models/Translation.ts
export interface Translation {
    id: number;
    originalText: string;
    translatedText: string;
    sourceLang: string;
    targetLang: string;
    createdAt?: string;
    updatedAt?: string;
    users?: Array<{
        id: number;
        name: string;
    }>;
}
export interface Translation {
    id: number;
    originalText: string;
    translatedText: string;
    sourceLang: string;
    targetLang: string;
}

export const SUPPORTED_LANGUAGES: Record<string, string> = {
    en: "English",
    ru: "Russian",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    ja: "Japanese",
    zh: "Chinese"
};