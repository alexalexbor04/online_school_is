package com.example.online_school_is.repos;

import com.example.online_school_is.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // if i need an id in search

    @Query("select p from schedule p where concat(p.id, '', p.course_id, '', p.date, '', " +
            "p.start_time, '', p.end_time, '', p.room) like %?1%")
    List<Schedule> searchSchedule(String keyword);
}
