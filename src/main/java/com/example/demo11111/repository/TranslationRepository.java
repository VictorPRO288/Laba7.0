package com.example.demo11111.repository;

import com.example.demo11111.model.Translation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TranslationRepository extends JpaRepository<Translation, Integer> {

    // Кастомный запрос для поиска переводов по targetLang
    @Query("SELECT t FROM Translation t WHERE t.targetLang = :targetLang")
    List<Translation> findByTargetLang(@Param("targetLang") String targetLang);
}