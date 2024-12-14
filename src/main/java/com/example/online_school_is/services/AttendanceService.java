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

    public Attendance save(Attendance attendance) {
        repoAtt.save(attendance);
        return attendance;
    }

    public void delete(Long id) {
        repoAtt.deleteById(id);
    }

    public Attendance get(Long id) {
        return repoAtt.findById(id).get();
    }

//    public List<Attendance> filterByDate(java.sql.Date date) {
//        return repoAtt.filterByDate(date);
//    }

    public List<Attendance> filterByStatus(String status) {
        return repoAtt.filterByStatus(status);
    }
}
