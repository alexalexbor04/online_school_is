package com.example.online_school_is.services;

import com.example.online_school_is.entity.Schedule;
import com.example.online_school_is.repos.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository repoSch;

    public List<Schedule> listAll(String keyword) {
        if (keyword != null) {
            return repoSch.searchSchedule(keyword);
        }
        return repoSch.findAll();
    }

    public void save(Schedule schedule) {
        repoSch.save(schedule);
    }

    public Schedule get(Long id) {
        return repoSch.findById(id).get();
    }

    public void delete(Long id) {
        repoSch.deleteById(id);
    }
}
