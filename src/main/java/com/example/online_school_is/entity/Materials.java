package com.example.online_school_is.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "materials")
public class Materials {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", referencedColumnName = "id", nullable = false)
    private Courses course_id;

    @Column(name = "title", nullable = false, length = 100)
    private String title;

    @Column(name = "file_path", nullable = false)
    private String file_path;

    public Materials() {}

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Courses getCourse_id() { return course_id; }

    public void setCourse_id(Courses course_id) { this.course_id = course_id; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getFile_path() { return file_path; }

    public void setFile_path(String file_path) { this.file_path = file_path; }
}
