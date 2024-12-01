package com.example.online_school_is.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "attendance")
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    private Users student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", referencedColumnName = "id")
    private Schedule schedule;

    private String status;

    private String date;

    public Attendance() {}

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Users getStudent() { return student; }

    public void setStudent(Users student) { this.student = student; }
}

