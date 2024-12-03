package com.example.online_school_is.repos;

import com.example.online_school_is.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    @Query("select p from Attendance p where concat(p.id, '', p.student_id, '', p.schedule_id, '', " +
            "p.status, '', p.date) like %?1%")
    List<Attendance> searchAttendance(String keyword);
}
