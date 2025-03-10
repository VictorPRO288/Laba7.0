package com.example.demo11111.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    // Логирование перед выполнением методов
    @Before("execution(* com.example.demo11111.controller.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        logger.info("Вызов метода: " + joinPoint.getSignature().getName());
    }

    // Логирование ошибок
    @AfterThrowing(pointcut = "execution(* com.example.demo11111.controller.*.*(..))", throwing = "ex")
    public void logAfterThrowing(JoinPoint joinPoint, Throwable ex) {
        logger.error("Ошибка в методе: " + joinPoint.getSignature().getName(), ex);
    }
}