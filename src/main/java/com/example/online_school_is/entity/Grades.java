package com.example.online_school_is.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "grades")
public class Grades {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", referencedColumnName = "id", nullable = false)
    private Users student_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", referencedColumnName = "id", nullable = false)
    private Courses course_id;

    @Column(name = "grade", nullable = false)
    private Double grade;

    @Column(name = "comment")
    private String comment;

    @Column(name = "date", nullable = false)
    private String date;

    public Grades() {}

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Users getStudent_id() { return student_id; }

    public void setStudent_id(Users student_id) { this.student_id = student_id; }

    public Courses getCourse_id() { return course_id; }

    public void setCourse_id(Courses course_id) { this.course_id = course_id; }

    public Double getGrade() { return grade; }

    public void setGrade(Double grade) { this.grade = grade; }

    public String getComment() { return comment; }

    public void setComment(String comment) { this.comment = comment; }

    public String getDate() { return date; }

    public void setDate(String date) { this.date = date; }
}
