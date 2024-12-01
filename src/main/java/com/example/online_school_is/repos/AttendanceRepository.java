package com.example.online_school_is.repos;

import com.example.online_school_is.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    @Query("select p from users p where concat(p.id, '', p.username, '', p.password, '', " +
            "p.role_id, '', p.full_name, '', p.email, '', p.phone) like %?1%")
    List<Attendance> searchAttendance(String keyword);
}
