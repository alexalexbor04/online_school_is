package com.example.online_school_is.controllers;

import com.example.online_school_is.entity.Attendance;
import com.example.online_school_is.repos.AttendanceRepository;
import com.example.online_school_is.services.AttendanceService;
import org.hibernate.boot.model.source.spi.PluralAttributeElementNature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/* уд, ред, доб - АДМИН
* Просмотр - УЧИТЕЛЬ, СТУДЕНТ, АДМИН*/
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AttendanceController {

    @Autowired
    private AttendanceRepository repo;

    @Autowired
    private AttendanceService service;

    @GetMapping("/attendance")
    public ResponseEntity<List<Attendance>> viewAttendance(@Param("keyword") String keyword) {
        List<Attendance> listAtten;
        if (keyword != null) {
            listAtten = service.listAll(keyword);
        } else {
            listAtten = service.listAll(null);
        }
        return ResponseEntity.ok(listAtten);
    }

    @PostMapping("/attendance/new")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Attendance> createAttendance(@RequestBody Attendance attendance) {
        try {
            Attendance createdAtt = service.save(attendance);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAtt);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/attendance/edit/{id}")
    @PreAuthorize("hasAnyRole('admin', 'teacher', 'student')")
    public ResponseEntity<Attendance> getAttendanceById(@PathVariable Long id) {
        Attendance attendance = service.get(id);
        return attendance != null
                ? ResponseEntity.ok(attendance)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/attendance/edit/{id}")
    @PreAuthorize("hasRole('teacher')")
    public ResponseEntity<Attendance> updateAttendance(@PathVariable Long id, @RequestBody Attendance attendance) {
        try {
            Attendance existAtt = service.get(id);
            if (existAtt != null) {
                existAtt.setStudent(attendance.getStudent());
                existAtt.setSchedule(attendance.getSchedule());
                existAtt.setStatus(attendance.getStatus());
                Attendance saveAtt = repo.save(existAtt);
                return ResponseEntity.ok(saveAtt);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/attendance/{id}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
