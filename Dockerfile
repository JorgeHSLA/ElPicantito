# Stage 1: Build
FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /build
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:go-offline -B
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime
FROM gcr.io/distroless/java21-debian12
WORKDIR /app
COPY --from=builder /build/target/*.jar /app/app.jar
EXPOSE 9998
ENTRYPOINT ["java", "-jar", "/app/app.jar"]