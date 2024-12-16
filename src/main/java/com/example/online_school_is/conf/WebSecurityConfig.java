package com.example.online_school_is.conf;

import com.example.online_school_is.services.UserServicesDet;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.authentication.AuthenticationManager;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

@Configuration
public class WebSecurityConfig {

    private final UserServicesDet userSD;

    public WebSecurityConfig(UserServicesDet userSD) {
        this.userSD = userSD;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authManager) throws Exception {
        http.cors().and().csrf().disable()
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/register", "/auth/login").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jsonLoginFilter(authManager), UsernamePasswordAuthenticationFilter.class)
                .logout(logout -> logout
                        .logoutUrl("/auth/logout")
                        .logoutSuccessUrl("/auth/login")
                        .permitAll()
                );

        return http.build();
    }

    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(userSD)
                .passwordEncoder(passwordEncoder())
                .and()
                .build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public OncePerRequestFilter jsonLoginFilter(AuthenticationManager authManager) {
        return new OncePerRequestFilter() {
            private final ObjectMapper objectMapper = new ObjectMapper();

            @Override
            protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
                    throws IOException, ServletException {
                if ("/auth/login".equals(request.getRequestURI()) && HttpMethod.POST.matches(request.getMethod())) {
                    try {
                        // Чтение JSON данных
                        Map<String, String> credentials = objectMapper.readValue(request.getInputStream(), Map.class);
                        String username = credentials.get("username");
                        String password = credentials.get("password");

                        // Аутентификация через AuthenticationManager
                        Authentication authRequest = new UsernamePasswordAuthenticationToken(username, password);
                        Authentication authResult = authManager.authenticate(authRequest);

                        // Установка аутентификации в SecurityContext
                        SecurityContextHolder.getContext().setAuthentication(authResult);

                        response.setStatus(HttpServletResponse.SC_OK);
                        response.getWriter().write("Вход выполнен успешно!");
                    } catch (Exception e) {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        response.getWriter().write("Неправильное имя пользователя или пароль");
                    }
                } else {
                    filterChain.doFilter(request, response);
                }
            }
        };
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("http://localhost:*"); // Разрешить все источники
        config.addAllowedHeader("*"); // Разрешить все заголовки
        config.addAllowedMethod("*"); // Разрешить все методы (GET, POST и т.д.)
        config.addExposedHeader("Authorization"); // Если требуется передать заголовок

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
