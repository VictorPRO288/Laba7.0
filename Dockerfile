# Билд бэкенда (Spring Boot)
FROM maven:3.8.6-eclipse-temurin-17 AS backend-build
WORKDIR /app
# Копируем только файлы, необходимые для сборки Maven
COPY pom.xml mvnw* ./
COPY .mvn/ .mvn/
RUN ./mvnw dependency:go-offline
# Копируем исходники бэкенда
COPY src ./src
RUN ./mvnw package -DskipTests

# Билд фронтенда (React)
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json .
RUN npm install
COPY frontend .
RUN npm run build

# Финальный образ
FROM eclipse-temurin:17-jre
WORKDIR /app

# Копируем бэкенд
COPY --from=backend-build /app/target/*.jar app.jar
# Копируем фронтенд
COPY --from=frontend-build /app/frontend/build ./static

# Настройки для Railway
ENV PORT=8080
EXPOSE $PORT

# Запускаем приложение
CMD ["java", "-jar", "app.jar", "--server.port=${PORT}", "--server.address=0.0.0.0"]