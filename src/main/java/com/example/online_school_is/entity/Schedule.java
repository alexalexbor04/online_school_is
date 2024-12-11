package com.example.online_school_is.entity;

import jakarta.persistence.*;

import java.util.Set;

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

    @Column(name = "date", nullable = false)
    private String date;

    @Column(name = "start_time", nullable = false)
    private String start_time;

    @Column(name = "end_time", nullable = false)
    private String end_time;

    @Column(name = "room", length = 50)
    private String room;

    @OneToMany(mappedBy = "schedule_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Attendance> attendances;

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
