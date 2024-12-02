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
                        // Разрешить доступ к статическим ресурсам, странице входа, регистрации и ошибкам
                        .requestMatchers("/css/**", "/js/**", "/images/**", "/login", "/register", "/error/**").permitAll()
                        // Разрешить доступ к административным URL только пользователям с ролью ADMIN
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        // Все остальные запросы требуют аутентификации
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .defaultSuccessUrl("/", true)
                        .permitAll()
                )
                .logout(logout -> logout
                        .permitAll()
                )
                // Отключить CSRF для простоты (не рекомендуется для продакшена)
                .csrf(AbstractHttpConfigurer::disable);

        // Установить аутентификационный провайдер
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
}
