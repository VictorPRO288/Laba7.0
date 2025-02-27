package com.example.demo11111.service;

import com.example.demo11111.model.Translation;
import com.example.demo11111.model.User;
import com.example.demo11111.repository.TranslationRepository;
import com.example.demo11111.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TranslationRepository translationRepository; // Добавлено

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUserById(Integer id) {
        userRepository.deleteById(id);
    }

    // Метод для добавления перевода пользователю
    public void addTranslationToUser(Integer userId, Integer translationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        Translation translation = translationRepository.findById(translationId)
                .orElseThrow(() -> new RuntimeException("Перевод не найден"));

        user.getTranslations().add(translation);
        translation.getUsers().add(user);

        userRepository.save(user);
        translationRepository.save(translation);
    }

    // Метод для удаления перевода у пользователя
    public void removeTranslationFromUser(Integer userId, Integer translationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        Translation translation = translationRepository.findById(translationId)
                .orElseThrow(() -> new RuntimeException("Перевод не найден"));

        user.getTranslations().remove(translation);
        translation.getUsers().remove(user);

        userRepository.save(user);
        translationRepository.save(translation);
    }
}