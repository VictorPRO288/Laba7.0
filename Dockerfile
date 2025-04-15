# Билд бэкенда
FROM maven:3.8.6-eclipse-temurin-17 AS backend-build
WORKDIR /app

# 1. Сначала копируем ВСЮ папку .mvn целиком
COPY .mvn ./.mvn
COPY mvnw* ./
COPY pom.xml ./

# 2. Устанавливаем права
RUN chmod +x mvnw && \
    chmod -R 755 .mvn

# 3. Копируем исходники
COPY src ./src

# 4. Собираем проект
RUN ./mvnw -B dependency:resolve
RUN ./mvnw -B package -DskipTests

# Остальная часть Dockerfile остается без изменений

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