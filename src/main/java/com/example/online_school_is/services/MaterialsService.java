package com.example.online_school_is.services;

import com.example.online_school_is.entity.Materials;
import com.example.online_school_is.repos.MaterialsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialsService {

    @Autowired
    private MaterialsRepository repoMat;

    public List<Materials> listAll(String keyword) {
        if (keyword != null) {
            return repoMat.searchMat(keyword);
        }
        return repoMat.findAll();
    }

    public Materials save(Materials mat) {
        repoMat.save(mat);
        return mat;
    }

    public void delete(Long id) {
        repoMat.deleteById(id);
    }

    public Materials get(Long id) {
        return repoMat.findById(id).get();
    }
}
