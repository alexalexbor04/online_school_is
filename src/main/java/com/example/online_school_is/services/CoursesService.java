package com.example.online_school_is.services;

import com.example.online_school_is.entity.Courses;
import com.example.online_school_is.repos.CoursesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoursesService {

    @Autowired
    private CoursesRepository repoCour;

    public List<Courses> listAll(String keyword) {
        if (keyword != null) {
            return repoCour.searchCourse(keyword);
        }
        return repoCour.findAll();
    }

    public void save(Courses courses) {
        repoCour.save(courses);
    }

    public void delete(Courses courses) {
        repoCour.delete(courses);
    }

    public Courses get(Long id) {
        return repoCour.findById(id).get();
    }
}
