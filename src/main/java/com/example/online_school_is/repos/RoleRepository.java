package com.example.online_school_is.repos;

import com.example.online_school_is.entity.Roles;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Roles, Long> {
    Optional<Roles> findByName(String username);
}
