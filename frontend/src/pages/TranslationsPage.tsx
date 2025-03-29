import React, { useState } from 'react';
import { translationApi } from '../api/translationApi';

import { Box, TextField, Button, Select, MenuItem, Typography } from '@mui/material';

const TranslationsPage: React.FC = () => {
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('ru');
    const [error, setError] = useState('');

    const handleTranslate = async () => {
        try {
            const response = await translationApi.createTranslation(text, sourceLang, targetLang);
            setTranslatedText(response.translatedText); // Или просто response, если API изменится
            setError('');
        } catch (err) {
            setError('Translation failed. Please try again.');
            console.error(err);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Translation Service
            </Typography>

            <TextField
                label="Text to translate"
                value={text}
                onChange={(e) => setText(e.target.value)}
                fullWidth
                multiline
                rows={4}
            />

            <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                <Select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="ru">Russian</MenuItem>
                </Select>

                <Button onClick={() => {
                    const temp = sourceLang;
                    setSourceLang(targetLang);
                    setTargetLang(temp);
                }}>
                    ↔
                </Button>

                <Select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="ru">Russian</MenuItem>
                </Select>
            </Box>

            <Button
                variant="contained"
                onClick={handleTranslate}
                disabled={!text}
            >
                TRANSLATE
            </Button>

            {translatedText && (
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h6">Translation:</Typography>
                    <Typography>{translatedText}</Typography>
                </Box>
            )}

            {error && <Typography color="error">{error}</Typography>}
        </Box>
    );
};

