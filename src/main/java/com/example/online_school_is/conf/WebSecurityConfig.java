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
                        // Разрешить регистрацию и доступ к открытым API
                        .requestMatchers("/auth/register", "/auth/login").permitAll()
                        // Ограничить доступ для административных маршрутов
                        .requestMatchers("/admin/**").hasRole("ADMIN")
//                        .requestMatchers("/teacher/**").hasRole("TAECHER")
                        // Остальные запросы требуют аутентификации
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/auth/login") // Укажите маршрут для страницы логина
                        .defaultSuccessUrl("/attendance", true) // Укажите маршрут после успешного входа
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("/auth/login")
                        .permitAll()
                )
                // Использование HTTP Basic Authentication (или JWT)
                .httpBasic()
                .and()
                // Отключить CSRF, так как мы используем RESTful API
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
}

