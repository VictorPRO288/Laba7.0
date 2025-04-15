# Билд бэкенда
FROM maven:3.8.6-eclipse-temurin-17 AS backend-build
WORKDIR /app

# 1. Копируем только необходимые файлы для Maven Wrapper
COPY mvnw* ./
COPY .mvn/wrapper/maven-wrapper.properties .mvn/wrapper/
COPY .mvn/wrapper/maven-wrapper.jar .mvn/wrapper/

# 2. Устанавливаем права (ключевое исправление для Windows)
RUN chmod +x mvnw && \
    chmod -R 755 .mvn

# 3. Копируем POM и исходники
COPY pom.xml ./
COPY src ./src

# 4. Собираем проект (с кэшированием зависимостей)
RUN ./mvnw -B dependency:resolve
RUN ./mvnw -B package -DskipTests

# Билд фронтенда
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json .
RUN npm install
COPY frontend .
RUN npm run build

# Финальный образ
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar
COPY --from=frontend-build /app/frontend/build ./static

# Для Railway
ENV PORT=8080
EXPOSE $PORT
CMD ["java", "-jar", "app.jar", "--server.port=${PORT}", "--server.address=0.0.0.0"]