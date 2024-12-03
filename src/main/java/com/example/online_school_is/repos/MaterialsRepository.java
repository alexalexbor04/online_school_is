package com.example.online_school_is.repos;

import com.example.online_school_is.entity.Materials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaterialsRepository extends JpaRepository<Materials, Long> {

    @Query("select p from Materials p where concat(p.id, '', p.course_id, '', p.title, '', " +
            "p.file_path) like %?1%")
    List<Materials> searchMat(String keyword);
}
