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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
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
        http.cors().and().csrf().disable()
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/auth/register", "/auth/login").permitAll()
                        .anyRequest().permitAll()
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

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true); // Разрешить передачу cookies
        config.addAllowedOriginPattern("http://localhost:5173"); // Укажите ваш фронтенд (например, Vue/React/Angular)
        config.addAllowedHeader("*"); // Разрешить любые заголовки
        config.addAllowedMethod("*"); // Разрешить любые методы
//        config.addExposedHeader("Authorization"); // Указать нужные заголовки, если это необходимо

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}

