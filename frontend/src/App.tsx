// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Box,
    CircularProgress,
    Alert,
    CssBaseline,
    createTheme,
    ThemeProvider
} from '@mui/material';
import TranslationList from './components/TranslationList';
import TranslationBox from './components/TranslationBox';
import { translationApi } from './api/translationApi';
import { Translation } from './models/Translation';

// Создаем цветную тему
const theme = createTheme({
    palette: {
        primary: {
            main: '#F37C27',
        },
        secondary: {
            main: '#000000',
        },
    },
});

const App: React.FC = () => {
    const [translations, setTranslations] = useState<Translation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTranslations = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await translationApi.getAllTranslations();
            setTranslations(data);
        } catch (err) {
            setError('Failed to load translations. Please try again later.');
            console.error('Error loading translations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTranslations();
    }, []);

    const handleTranslationCreated = () => {
        loadTranslations();
    };

    const handleDeleteTranslation = (id: number) => {
        setTranslations(translations.filter(t => t.id !== id));
    };

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <CssBaseline />
                <AppBar position="static" elevation={1}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{
                            flexGrow: 1,
                            fontWeight: 600
                        }}>
                            <Box component="span" sx={{ color: 'white' }}>
                                🌍 Global Translator
                            </Box>
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="lg" sx={{ py: 4 }}>
                    {error && (
                        <Alert
                            severity="error"
                            sx={{ mb: 3 }}
                            onClose={() => setError(null)}
                        >
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <TranslationBox onTranslationCreated={handleTranslationCreated} />
                        <TranslationList
                            translations={translations}
                            onDelete={handleDeleteTranslation}
                            isLoading={loading}
                            error={error}
                            refreshTranslations={loadTranslations}
                        />
                    </Box>
                </Container>
            </Router>
        </ThemeProvider>
    );
};

export default App;
