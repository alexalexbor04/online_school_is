package com.example.online_school_is.repos;

import com.example.online_school_is.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {

    Optional<Users> findByUsername(String username);

    @Query("select p from Users p where concat(p.id, '', p.username, '', p.role, '', " +
            "p.full_name, '', p.email, '', p.phone) like %?1%")
    List<Users> searchUsers(String keyword);
}

