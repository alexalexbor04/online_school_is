package com.example.online_school_is.controllers;

import com.example.online_school_is.entity.Grades;
import com.example.online_school_is.repos.GradesRepository;
import com.example.online_school_is.services.GradesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/grades")
@RestController
public class GradesController {

    @Autowired
    private GradesService service;

    @Autowired
    private GradesRepository repo;

    @GetMapping("/")
    public ResponseEntity<List<Grades>> viewGrades(@Param("keyword") String keyword) {
        List<Grades> listGrades;
        if (keyword != null) {
            listGrades = service.listAll(keyword);
        } else {
            listGrades = repo.findAll();
        }
        return ResponseEntity.ok(listGrades);
    }

    @PreAuthorize("hasRole('teacher')")
    @PostMapping("/new")
    public ResponseEntity<Grades> newGrade(@RequestBody Grades grades) {
        try {
            Grades createdGrade = service.save(grades);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdGrade);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PreAuthorize("hasRole('teacher')")
    @GetMapping("/edit/{id}")
    public ResponseEntity<Grades> editGrade(@PathVariable Long id) {
        Grades grade = service.get(id);
        return grade != null
                ? ResponseEntity.ok(grade)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PreAuthorize("hasRole('teacher')")
    @PutMapping("/edit/{id}")
    public ResponseEntity<Grades> updateGrade(@PathVariable Long id, @RequestBody Grades grade) {
        try {
            Grades existGrade = service.get(id);
            if (existGrade != null) {
                existGrade.setComment(grade.getComment());
                existGrade.setDate(grade.getDate());
                existGrade.setGrade(grade.getGrade());
                existGrade.setCourse_id(grade.getCourse_id());
                existGrade.setStudent_id(grade.getStudent_id());
                Grades saveGrade = service.save(existGrade);
                return ResponseEntity.ok(saveGrade);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PreAuthorize("hasRole('teacher')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Grades> deleteGrade(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
