package com.example.demo11111.service;

import com.example.demo11111.cache.TranslationCache;
import com.example.demo11111.dto.BulkTranslationRequest;
import com.example.demo11111.model.Translation;
import com.example.demo11111.repository.TranslationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TranslationService {

    private static final String TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single?client=gtx&sl={sourceLang}&tl={targetLang}&dt=t&q={text}";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RequestCounterService requestCounterService;
    private final TranslationRepository translationRepository;
    private final TranslationCache translationCache;

    @Autowired
    public TranslationService(TranslationRepository translationRepository,
                              TranslationCache translationCache,
                              RequestCounterService requestCounterService) {
        this.translationRepository = translationRepository;
        this.translationCache = translationCache;
        this.requestCounterService = requestCounterService;
    }

    public List<Translation> translateBulk(BulkTranslationRequest request) {
        return request.getTexts().stream()
                .map(text -> {
                    requestCounterService.increment();
                    return translateAndSave(text, request.getSourceLang(), request.getTargetLang());
                })
                .collect(Collectors.toList());
    }

    public Translation translateAndSave(String text, String sourceLang, String targetLang) {
        requestCounterService.increment(); // Увеличиваем счетчик обращений
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(
                    TRANSLATE_URL, String.class, sourceLang, targetLang, text);

            JsonNode rootNode = objectMapper.readTree(response.getBody());
            JsonNode translatedTextNode = rootNode.get(0).get(0).get(0);
            String translatedText = translatedTextNode.asText();

            Translation translation = new Translation();
            translation.setOriginalText(text);
            translation.setTranslatedText(translatedText);
            translation.setSourceLang(sourceLang);
            translation.setTargetLang(targetLang);

            return translationRepository.save(translation);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при переводе текста: " + e.getMessage(), e);
        }
    }

    public List<Translation> getTranslationsByTargetLang(String targetLang) {
        requestCounterService.increment(); // Увеличиваем счетчик обращений

        List<Translation> cachedTranslations = translationCache.get(targetLang);
        if (cachedTranslations != null) {
            return cachedTranslations;
        }

        List<Translation> translations = translationRepository.findByTargetLang(targetLang);
        translationCache.put(targetLang, translations);
        return translations;
    }

    public List<Translation> getAllTranslations() {
        requestCounterService.increment(); // Увеличиваем счетчик обращений
        return translationRepository.findAll();
    }

    public Optional<Translation> getTranslationById(Integer id) {
        requestCounterService.increment(); // Увеличиваем счетчик обращений
        return translationRepository.findById(id);
    }

    public void deleteTranslationById(Integer id) {
        requestCounterService.increment(); // Увеличиваем счетчик обращений
        translationRepository.deleteById(id);
    }
}