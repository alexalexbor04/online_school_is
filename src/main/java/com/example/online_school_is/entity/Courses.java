package com.example.online_school_is.entity;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "courses")
public class Courses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String course_name;

    @Column(name = "description")
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "teacher_id", referencedColumnName = "id", foreignKey = @ForeignKey(name = "fk_courses_users"))
    private Users teacher_id;

    /* dependences*/

    @OneToMany(mappedBy = "course_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Materials> materials;

    @OneToMany(mappedBy = "course_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Schedule> schedules;

    @OneToMany(mappedBy = "course_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Grades> grades;

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
