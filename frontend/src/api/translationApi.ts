import axios from 'axios';
import { Translation } from '../models/Translation';

const API_BASE_URL = 'http://192.168.175.79:8080/api/translations';

export const translationApi = {
    createTranslation: async (text: string, sourceLang: string, targetLang: string): Promise<Translation> => {
        try {
            const response = await axios.post(API_BASE_URL, {
                text,
                sourceLang,
                targetLang
            });
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw new Error('Translation service unavailable');
        }
    },

    getAllTranslations: async (): Promise<Translation[]> => {
        const response = await axios.get<Translation[]>(API_BASE_URL);
        return response.data;
    },

    getSupportedLanguages: async (): Promise<Record<string, string>> => {
        const response = await axios.get(`${API_BASE_URL}/languages`);
        return response.data;
    },

    deleteTranslation: async (id: number): Promise<void> => {
        await axios.delete(`${API_BASE_URL}/${id}`);
    }
};
