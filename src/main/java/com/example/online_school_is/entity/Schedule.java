package com.example.online_school_is.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "schedule")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", referencedColumnName = "id")
    private Courses course_id;
    private String date;
    private String start_time;
    private String end_time;
    private String room;

    public Schedule() {}

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Courses getCourse_id() { return course_id; }

    public void setCourse_id(Courses course_id) { this.course_id = course_id; }

    public String getDate() { return date; }

    public void setDate(String date) { this.date = date; }

    public String getStart_time() { return start_time; }

    public void setStart_time(String start_time) { this.start_time = start_time; }

    public String getEnd_time() { return end_time; }

    public void setEnd_time(String end_time) { this.end_time = end_time; }

    public String getRoom() { return room; }

    public void setRoom(String room) { this.room = room; }

}
