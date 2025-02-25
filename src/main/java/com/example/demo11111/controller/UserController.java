package com.example.demo11111.controller;

import com.example.demo11111.service.UserService;
import com.example.demo11111.moduli.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        Optional<User> user = userService.getUserById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Пользователь с ID " + id + " не найден");
        }
    }

    @GetMapping("/{userId}/translations")
    public ResponseEntity<?> getTranslationsByUserId(@PathVariable Integer userId) {
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get().getTranslations());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Пользователь с ID " + userId + " не найден");
        }
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody User userDetails) {
        Optional<User> user = userService.getUserById(id);
        if (user.isPresent()) {
            userDetails.setId(id);
            return ResponseEntity.ok(userService.saveUser(userDetails));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Пользователь с ID " + id + " не найден");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/{userId}/translations/{translationId}")
    public ResponseEntity<Void> addTranslationToUser(
            @PathVariable Integer userId,
            @PathVariable Integer translationId) {
        userService.addTranslationToUser(userId, translationId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}/translations/{translationId}")
    public ResponseEntity<Void> removeTranslationFromUser(
            @PathVariable Integer userId,
            @PathVariable Integer translationId) {
        userService.removeTranslationFromUser(userId, translationId);
        return ResponseEntity.noContent().build();
    }
}
