package com.example.online_school_is.services;

import com.example.online_school_is.entity.Attendance;
import com.example.online_school_is.repos.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository repoAtt;

    public List<Attendance> listAll(String keyword) {
        if (keyword != null) {
            return repoAtt.searchAttendance(keyword);
        }
        return repoAtt.findAll();
    }

    public void save(Attendance attendance) {
        repoAtt.save(attendance);
    }

    public void delete(Attendance attendance) {
        repoAtt.save(attendance);
    }

    public Attendance get(Long id) {
        return repoAtt.findById(id).get();
    }
}
