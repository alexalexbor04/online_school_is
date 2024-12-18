package com.example.online_school_is.services;

import com.example.online_school_is.entity.Grades;
import com.example.online_school_is.repos.GradesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradesService {

    @Autowired
    private GradesRepository repoGrades;

    public List<Grades> listAll(String keyword) {
        if (keyword != null) {
            return repoGrades.searchGrade(keyword);
        }
        return repoGrades.findAll();
    }

    public Grades save(Grades grades) {
        repoGrades.save(grades);
        return grades;
    }

    public void delete(Long id) {
        repoGrades.deleteById(id);
    }

    public Grades get(Long id) {
        return repoGrades.findById(id).get();
    }
}
