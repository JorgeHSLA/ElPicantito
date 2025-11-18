package com.picantito.picantito;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class PicantitoApplication {
	public static void main(String[] args) {
		// Cargar variables de entorno desde .env
		Dotenv dotenv = Dotenv.configure()
				.directory("ElPicantito")
				.ignoreIfMissing()
				.load();
		
		// Establecer las variables de entorno en el sistema
		dotenv.entries().forEach(entry -> 
			System.setProperty(entry.getKey(), entry.getValue())
		);
		
		SpringApplication.run(PicantitoApplication.class, args);
	}
}