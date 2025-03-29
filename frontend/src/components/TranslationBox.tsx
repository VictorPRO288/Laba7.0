// src/components/TranslationBox.tsx
import React, { useState } from 'react';
import { translationApi } from '../api/translationApi';
import {
    Box,
    TextField,
    Button,
    Select,
    MenuItem,
    Typography,
    FormControl,
    InputLabel,
    Alert,
    Paper,
    IconButton,
    useTheme
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TranslateIcon from '@mui/icons-material/Translate';

// Поддерживаемые языки
const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Russian' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' }
];

interface TranslationBoxProps {
    onTranslationCreated?: () => void;
}

const TranslationBox: React.FC<TranslationBoxProps> = ({ onTranslationCreated }) => {
    const [text, setText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('ru');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();

    const handleTranslate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) {
            setError('Please enter text to translate');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await translationApi.createTranslation(text, sourceLang, targetLang);
            setTranslatedText(result.translatedText);
            if (onTranslationCreated) onTranslationCreated();
        } catch (err) {
            setError('Translation failed. Please try again.');
            console.error('Translation error:', err);
        } finally {
            setLoading(false);
        }
    };

    const swapLanguages = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        if (translatedText) {
            setText(translatedText);
            setTranslatedText(text);
        }
    };

    return (
        <Paper elevation={3} sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: 'background.paper',
            mb: 4
        }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{
                mb: 3,
                fontWeight: 600,
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                gap: 1
            }}>
                <TranslateIcon fontSize="large" />
                Multi-Language Translator
            </Typography>

            <form onSubmit={handleTranslate}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <FormControl fullWidth size="medium">
                        <InputLabel>Source Language</InputLabel>
                        <Select
                            value={sourceLang}
                            label="Source Language"
                            onChange={(e) => setSourceLang(e.target.value)}
                            sx={{ bgcolor: 'background.paper' }}
                        >
                            {SUPPORTED_LANGUAGES.map((lang) => (
                                <MenuItem
                                    key={`source-${lang.code}`}
                                    value={lang.code}
                                    disabled={lang.code === targetLang}
                                >
                                    {lang.name} ({lang.code.toUpperCase()})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <IconButton
                        onClick={swapLanguages}
                        sx={{
                            bgcolor: theme.palette.primary.main,
                            color: 'white',
                            '&:hover': {
                                bgcolor: theme.palette.primary.dark,
                                transform: 'rotate(360deg)',
                                transition: 'transform 0.5s ease'
                            }
                        }}
                    >
                        <SwapHorizIcon />
                    </IconButton>

                    <FormControl fullWidth size="medium">
                        <InputLabel>Target Language</InputLabel>
                        <Select
                            value={targetLang}
                            label="Target Language"
                            onChange={(e) => setTargetLang(e.target.value)}
                            sx={{ bgcolor: 'background.paper' }}
                        >
                            {SUPPORTED_LANGUAGES.map((lang) => (
                                <MenuItem
                                    key={`target-${lang.code}`}
                                    value={lang.code}
                                    disabled={lang.code === sourceLang}
                                >
                                    {lang.name} ({lang.code.toUpperCase()})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box display="flex" gap={3} mb={3}>
                    <TextField
                        label="Enter text to translate"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        fullWidth
                        multiline
                        rows={5}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '& fieldset': {
                                    borderColor: theme.palette.primary.light
                                }
                            }
                        }}
                    />
                    <TextField
                        label="Translation result"
                        value={translatedText}
                        fullWidth
                        multiline
                        rows={5}
                        variant="outlined"
                        InputProps={{
                            readOnly: true,
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '& fieldset': {
                                    borderColor: theme.palette.secondary.light
                                }
                            }
                        }}
                    />
                </Box>

                <Box display="flex" justifyContent="center">
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading || !text.trim()}
                        startIcon={<TranslateIcon />}
                        sx={{
                            px: 6,
                            py: 1.5,
                            borderRadius: 2,
                            fontSize: '1rem',
                            fontWeight: 600,
                            textTransform: 'none',
                            boxShadow: 2,
                            '&:hover': {
                                boxShadow: 4
                            }
                        }}
                    >
                        {loading ? 'Translating...' : 'Translate Text'}
                    </Button>
                </Box>

                {error && (
                    <Alert
                        severity="error"
                        sx={{ mt: 3 }}
                        onClose={() => setError(null)}
                    >
                        {error}
                    </Alert>
                )}
            </form>
        </Paper>
    );
};

export default TranslationBox;