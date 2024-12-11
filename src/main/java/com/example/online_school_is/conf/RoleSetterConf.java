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
        Roles studentRole = repoRole.findByName("STUDENT").orElseGet(() -> {
            Roles role = new Roles();
            role.setName("STUDENT");
            return repoRole.save(role);
        });

        Roles teacherRole = repoRole.findByName("TEACHER").orElseGet(() -> {
            Roles role = new Roles();
            role.setName("TEACHER");
            return repoRole.save(role);
        });

        Roles admRole = repoRole.findByName("ADMIN").orElseGet(() -> {
            Roles role = new Roles();
            role.setName("ADMIN");
            return repoRole.save(role);
        });

        if (!repoUser.findByUsername("admin_s").isPresent()) {
            Users admin = new Users();
//            Set<Roles> set = new HashSet<>();
            admin.setUsername("admin_s");
            admin.setEmail("admin@email.com");
            admin.setFull_name("bbb");
            admin.setPhone("123456789");
            admin.setPassword(passEnc.encode("1234"));
            admin.setRoles(admRole);
            repoUser.save(admin);
        }

    }
}
