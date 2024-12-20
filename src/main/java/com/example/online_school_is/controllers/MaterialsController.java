package com.example.online_school_is.controllers;

import com.example.online_school_is.entity.Materials;
import com.example.online_school_is.repos.MaterialsRepository;
import com.example.online_school_is.services.MaterialsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/materials")
public class MaterialsController {

    @Autowired
    private MaterialsService service;

    @Autowired
    private MaterialsRepository repo;

    @GetMapping("/")
    public ResponseEntity<List<Materials>> viewMat(@Param("keyword") String keyword) {
        List<Materials> listMat;
        if (keyword != null) {
            listMat = service.listAll(keyword);
        } else {
            listMat = repo.findAll();
        }
        return ResponseEntity.ok(listMat);
    }

    @PreAuthorize("hasRole('teacher')")
    @PostMapping("/new")
    public ResponseEntity<Materials> newMat(@RequestBody Materials material) {
        try {
            Materials createdMat = service.save(material);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMat);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PreAuthorize("hasRole('teacher')")
    @GetMapping("/edit/{id}")
    public ResponseEntity<Materials> editMaterial(@PathVariable Long id) {
        Materials material = service.get(id);
        return material != null
                ? ResponseEntity.ok(material)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PreAuthorize("hasRole('teacher')")
    @PutMapping("/edit/{id}")
    public ResponseEntity<Materials> updateMaterial(@PathVariable Long id, @RequestBody Materials material) {
        try {
            Materials existMat = service.get(id);
            if (existMat != null) {
                existMat.setFile_path(material.getFile_path());
                existMat.setTitle(material.getTitle());
                existMat.setCourse_id(material.getCourse_id());
                Materials saveMat = service.save(existMat);
                return ResponseEntity.ok(saveMat);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PreAuthorize("hasRole('teacher')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Materials> deleteMat(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
