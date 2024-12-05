package com.example.online_school_is.controllers;

import com.example.online_school_is.entity.Attendance;
import com.example.online_school_is.repos.AttendanceRepository;
import com.example.online_school_is.services.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
//import org.springframework.ui.Model;

import java.util.List;

/* уд, ред, доб - АДМИН
* Просмотр - УЧИТЕЛЬ, СТУДЕНТ, АДМИН*/

@RestController
public class AttendanceController {

    @Autowired
    private AttendanceRepository repo;

    @Autowired
    private AttendanceService service;

    @GetMapping("/attendance")
    public ResponseEntity<List<Attendance>> viewAttendance(@Param("keyword") String keyword) {
        List<Attendance> listAtten = service.listAll(keyword);
        return listAtten != null && !listAtten.isEmpty()
                ? ResponseEntity.ok(listAtten)
                : ResponseEntity.notFound().build();
    } // надо ли создавать свой http stsus (код) для вывода отсутствия данных в базе

    @PostMapping("/attendance/new")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Attendance> createAttendance(@RequestBody Attendance attendance) {
        try {
            // Сохраняем объект в базе
            Attendance createdAtt = service.save(attendance);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAtt);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/attendance/edit/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<Attendance> getAttendanceById(@PathVariable Long id) {
        Attendance attendance = service.get(id);
        return attendance != null
                ? ResponseEntity.ok(attendance)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


}
