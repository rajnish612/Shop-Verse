package com.server.server.repository;

import com.server.server.entity.Category;
import com.server.server.projection.CategoryCountProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepo extends JpaRepository<Category, Long> {
    boolean existsByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);

    boolean existsByParentId(Long parentId);

    @Query("SELECT " +
            "COUNT(CASE WHEN c.parent IS NULL THEN 1 END) as rootCount, " +
            "COUNT(CASE WHEN c.parent IS NOT NULL THEN 1 END) as nestedCount " +
            "FROM Category c")
    CategoryCountProjection countRootAndNestedCategory();

    List<Category> findByParentId(Long parentId);
}
