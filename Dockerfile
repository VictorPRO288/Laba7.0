FROM eclipse-temurin:17-jre
COPY target/demo11111-*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]