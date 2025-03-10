package com.example.demo11111.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "translations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Translation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String originalText;
    private String translatedText;
    private String sourceLang;
    private String targetLang;

    @ManyToMany(mappedBy = "translations")
    private List<User> users;
}