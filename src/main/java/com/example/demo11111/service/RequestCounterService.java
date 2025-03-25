package com.example.demo11111.service;

import org.springframework.stereotype.Service;

@Service
public class RequestCounterService {
    private int counter = 0;

    public synchronized void increment() {
        counter++;
    }

    public synchronized int getCount() {
        return counter;
    }

    public synchronized void reset() {
        counter = 0;
    }
}