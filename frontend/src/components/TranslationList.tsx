// src/components/TranslationList.tsx
import React from 'react';
import { Translation } from '../models/Translation';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { translationApi } from '../api/translationApi';

interface TranslationListProps {
    translations: Translation[];
    onDelete?: (id: number) => void;
    isLoading?: boolean;
    error?: string | null;
    refreshTranslations?: () => void;
}

const TranslationList: React.FC<TranslationListProps> = ({
                                                             translations,
                                                             onDelete,
                                                             isLoading,
                                                             error,
                                                             refreshTranslations
                                                         }) => {
    const [localLoading, setLocalLoading] = React.useState<number | null>(null);

    const handleDelete = async (id: number) => {
        setLocalLoading(id);
        try {
            await translationApi.deleteTranslation(id);
            if (onDelete) {
                onDelete(id);
            }
            if (refreshTranslations) {
                refreshTranslations();
            }
        } catch (err) {
            console.error('Failed to delete translation:', err);
        } finally {
            setLocalLoading(null);
        }
    };

    if (isLoading && translations.length === 0) {
        return (
            <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ my: 2 }}>
                {error}
            </Alert>
        );
    }

    if (translations.length === 0) {
        return (
            <Alert severity="info" sx={{ my: 2 }}>
                No translations available
            </Alert>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Original Text</TableCell>
                        <TableCell>Translated Text</TableCell>
                        <TableCell>Source</TableCell>
                        <TableCell>Target</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {translations.map((translation) => (
                        <TableRow key={translation.id}>
                            <TableCell>{translation.originalText}</TableCell>
                            <TableCell>{translation.translatedText}</TableCell>
                            <TableCell>{translation.sourceLang.toUpperCase()}</TableCell>
                            <TableCell>{translation.targetLang.toUpperCase()}</TableCell>
                            <TableCell align="right">
                                <Tooltip title="Delete translation">
                                    <IconButton
                                        onClick={() => handleDelete(translation.id)}
                                        disabled={localLoading === translation.id}
                                    >
                                        {localLoading === translation.id ? (
                                            <CircularProgress size={24} />
                                        ) : (
                                            <DeleteIcon color="error" />
                                        )}
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TranslationList;