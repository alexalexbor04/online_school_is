package com.example.online_school_is.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class Courses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String course_name;
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", referencedColumnName = "id")
    private Users teacher_id;

    public Courses() {}

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getCourse_name() { return course_name; }

    public void setCourse_name(String course_name) { this.course_name = course_name; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public Users getTeacher_id() { return teacher_id; }

    public void setTeacher_id(Users teacher_id) { this.teacher_id = teacher_id; }
}
