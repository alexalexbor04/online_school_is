package com.example.online_school_is.conf;

import com.example.online_school_is.services.UserServicesDet;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.reactive.config.CorsRegistry;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    private final UserServicesDet userSD;

    public WebSecurityConfig(UserServicesDet userSD){
        this.userSD = userSD;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/auth/register", "/auth/login").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/auth/login")          // Указываем GET-страницу логина
                        .loginProcessingUrl("/auth/login") // Указываем POST-эндпоинт для обработки логина
                        .defaultSuccessUrl("/attendance", true) // Перенаправление после успешного входа
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/auth/login")
                        .permitAll()
                )
                .csrf(AbstractHttpConfigurer::disable);

        http.authenticationProvider(authenticationProvider());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userSD);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOrigins("http://localhost:3000") // Укажите порт фронтенда
//                .allowedMethods("GET", "POST", "PUT", "DELETE")
//                .allowedHeaders("*");
//    }
}

