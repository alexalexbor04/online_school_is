package com.example.online_school_is.conf;

import com.example.online_school_is.entity.Roles;
import com.example.online_school_is.entity.Users;
import com.example.online_school_is.repos.RoleRepository;
import com.example.online_school_is.repos.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class RoleSetterConf implements CommandLineRunner {

    private final RoleRepository repoRole;
    private final UserRepository repoUser;
    private final PasswordEncoder passEnc;

    public RoleSetterConf(RoleRepository repoRole, UserRepository repoUser, PasswordEncoder passEnc) {
        this.repoRole = repoRole;
        this.repoUser = repoUser;
        this.passEnc = passEnc;
    }

    @Override
    public void run(String... args) throws Exception {
        Roles userRole = repoRole.findByName("USER").orElseGet(() -> {
            Roles role = new Roles();
            role.setRole_name("USER");
            return repoRole.save(role);
        });

        Roles admRole = repoRole.findByName("ADMIN").orElseGet(() -> {
            Roles role = new Roles();
            role.setRole_name("ADMIN");
            return repoRole.save(role);
        });

        if (!repoUser.findByUsername("admin_s").isPresent()) {
            Users admin = new Users();
            admin.setUsername("admin_s");
            admin.setPassword(passEnc.encode("1234"));
            Set<Roles> roles = new HashSet<>();
            roles.add(admRole);
            roles.add(userRole);
            admin.setRoles(roles);
            repoUser.save(admin);
        }

    }
}
