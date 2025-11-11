package com.picantito.picantito;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PicantitoApplication {
	public static void main(String[] args) {
		SpringApplication.run(PicantitoApplication.class, args);
	}
}