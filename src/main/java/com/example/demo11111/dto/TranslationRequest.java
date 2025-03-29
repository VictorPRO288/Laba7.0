package com.example.demo11111.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TranslationRequest {
    @NotBlank
    private String text;

    @Size(min = 2, max = 5)
    private String sourceLang;

    @Size(min = 2, max = 5)
    private String targetLang;
}