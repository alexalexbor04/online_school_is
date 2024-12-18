package com.example.online_school_is.controllers;

import com.example.online_school_is.entity.Courses;
import com.example.online_school_is.repos.CoursesRepository;
import com.example.online_school_is.services.CoursesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/courses")
@RestController
public class CoursesController {

    @Autowired
    private CoursesService service;

    @Autowired
    private CoursesRepository repo;

    @GetMapping("/")
    public ResponseEntity<List<Courses>> viewCourses(@Param("keyword") String keyword) {
        List<Courses> listCourses;
        if (keyword != null) {
            listCourses = service.listAll(keyword);
        } else {
            listCourses = repo.findAll();
        }
        return ResponseEntity.ok(listCourses);
    }

    @PreAuthorize("hasRole('admin')")
    @PostMapping("/new")
    public ResponseEntity<Courses> newCourse(@RequestBody Courses courses) {
        try {
            Courses createdCour = service.save(courses);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCour);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PreAuthorize("hasRole('admin')")
    @GetMapping("/edit/{id}")
    public ResponseEntity<Courses> editCourse(@PathVariable Long id) {
        Courses course = service.get(id);
        return course != null
                ? ResponseEntity.ok(course)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PreAuthorize("hasRole('admin')")
    @PutMapping("/edit/{id}")
    public ResponseEntity<Courses> updateCourse(@PathVariable Long id, @RequestBody Courses schedule) {
        try {
            Courses existCour = service.get(id);
            if (existCour != null) {
                existCour.setCourse_name(schedule.getCourse_name());
                existCour.setDescription(schedule.getDescription());
                existCour.setTeacher_id(schedule.getTeacher_id());
                Courses saveCour = service.save(existCour);
                return ResponseEntity.ok(saveCour);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Courses> deleteCourse(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
