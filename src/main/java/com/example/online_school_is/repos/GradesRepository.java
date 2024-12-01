package com.example.online_school_is.repos;

import com.example.online_school_is.entity.Grades;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GradesRepository extends JpaRepository<Grades, Long> {

    @Query("select p from users p where concat(p.id, '', p.student_id, '', p.course_id, '', " +
            "p.grade, '', p.comment, '', p.date) like %?1%")
    List<Grades> searchGrade(String keyword);
}
