package com.example.court_management_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class CourtManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(CourtManagementSystemApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(@org.springframework.lang.NonNull CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("http://localhost:3000") // React frontend URL
						.allowedMethods("*") // Allow all HTTP methods
						.allowedHeaders("*"); // Allow all headers
			}
		};
	}
}
