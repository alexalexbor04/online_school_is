package com.example.online_school_is.repos;

import com.example.online_school_is.entity.Courses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CoursesRepository extends JpaRepository<Courses, Long> {

    @Query("select p from users p where concat(p.id, '', p.course_name, '', p.description, '', " +
            "p.teacher_id) like %?1%")
    List<Courses> searchCourse(String keyword);

}
