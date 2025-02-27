package com.example.demo11111.service;


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

@Service
public class TranslationService {

    private static final String TRANSLATE_URL = "https://translate.googleapis.com/translate_a/single?client=gtx&sl={sourceLang}&tl={targetLang}&dt=t&q={text}";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private TranslationRepository translationRepository;

    public Translation translateAndSave(String text, String sourceLang, String targetLang) {
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

    public List<Translation> getAllTranslations() {
        return translationRepository.findAll();
    }

    public Optional<Translation> getTranslationById(Integer id) {
        return translationRepository.findById(id);
    }

    public void deleteTranslationById(Integer id) {
        translationRepository.deleteById(id);
    }
}