package com.example.online_school_is.controllers;

import com.example.online_school_is.entity.Schedule;
import com.example.online_school_is.repos.ScheduleRepository;
import com.example.online_school_is.services.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/schedule")
@RestController
public class ScheduleController {

    @Autowired
    private ScheduleService service;

    @Autowired
    private ScheduleRepository repo;

    @GetMapping("/")
    public ResponseEntity<List<Schedule>> viewSchedule() {
        List<Schedule> listSch;
        listSch = repo.findAll();
        return ResponseEntity.ok(listSch);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Schedule>> loadSchedule() {
        List<Schedule> listSch;
        listSch = repo.findAll();
        return ResponseEntity.ok(listSch);
    }

    @PreAuthorize("hasRole('admin')")
    @PostMapping("/new")
    public ResponseEntity<Schedule> newSchedule(@RequestBody Schedule schedule) {
        try {
            Schedule createdSch = service.save(schedule);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSch);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PreAuthorize("hasRole('admin, teacher')")
    @GetMapping("/edit/{id}")
    public ResponseEntity<Schedule> editSchedule(@PathVariable Long id) {
        Schedule schedule = service.get(id);
        return schedule != null
                ? ResponseEntity.ok(schedule)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PreAuthorize("hasRole('admin, teacher')")
    @PutMapping("/edit/{id}")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable Long id, @RequestBody Schedule schedule) {
        try {
            Schedule existSch = service.get(id);
            if (existSch != null) {
                existSch.setRoom(schedule.getRoom());
                existSch.setDate(schedule.getDate());
                existSch.setStart_time(schedule.getStart_time());
                existSch.setEnd_time(schedule.getEnd_time());
                existSch.setCourse_id(schedule.getCourse_id());
                Schedule saveSch = service.save(existSch);
                return ResponseEntity.ok(saveSch);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PreAuthorize("hasRole('admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Schedule> deleteSchedule(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
