package com.example.online_school_is.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "attendance")
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", referencedColumnName = "id", nullable = false)
    private Users student_id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "schedule_id", referencedColumnName = "id", nullable = false)
    private Schedule schedule_id;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "date", nullable = false)
    private String date;

    public Attendance() {}

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Users getStudent() { return student_id; }

    public void setStudent(Users student) { this.student_id = student; }

    public Schedule getSchedule() { return schedule_id; }

    public void setSchedule(Schedule schedule) { this.schedule_id = schedule; }

    public String getStatus() { return status; }

    public void setStatus(String status) { this.status = status; }

    public String getDate() { return date; }

    public void setDate(String date) { this.date = date; }
}

