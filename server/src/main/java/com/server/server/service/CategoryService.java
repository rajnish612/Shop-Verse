package com.server.server.service;


import com.server.server.dto.CategoryCountResponseDTO;
import com.server.server.dto.CategoryRequestDTO;
import com.server.server.dto.CategoryResponseDTO;
import com.server.server.entity.Category;
import com.server.server.exception.ApiException;
import com.server.server.projection.CategoryCountProjection;
import com.server.server.repository.CategoryRepo;
import com.server.server.repository.ProductRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepo categoryRepo;
    private final ProductRepo productRepo;


    //Retrieve all categories from the database and convert them to response DTOs
    @Cacheable(
            cacheNames = "categories",
            key = "'all'"
    )
    public List<CategoryResponseDTO> getAllCategories() {
        List<Category> categories = categoryRepo.findAll();
        Map<Long, CategoryResponseDTO> categoryMap = new HashMap<>();

        // Create DTOs first
        for (Category category : categories) {
            CategoryResponseDTO dto = toResponse(category);
            categoryMap.put(category.getId(), dto);
        }

        List<CategoryResponseDTO> roots = new ArrayList<>();

        // Attach each category to its parent
        for (Category category : categories) {

            CategoryResponseDTO dto =
                    categoryMap.get(category.getId());

            if (category.getParent() == null) {
                roots.add(dto);
            } else {
                CategoryResponseDTO parentDTO =
                        categoryMap.get(category.getParent()
                                .getId());

                if (parentDTO != null) {
                    parentDTO.getChildren()
                            .add(dto);
                }
            }
        }

        return roots;
    }

    //Method to count the number of root and nested categories in the database and return the counts in a response DTO
    public CategoryCountResponseDTO getCategoryCount() {
        CategoryCountProjection categoryCount = categoryRepo.countRootAndNestedCategory();
        return CategoryCountResponseDTO.builder()
                .rootCount(categoryCount.getRootCount())
                .nestedCount(categoryCount.getNestedCount())
                .build();
    }

    //Method to retrieve a category by its ID and convert it to a response DTO
    public CategoryResponseDTO getCategoryById(Long categoryId) {
        return toResponse(findCategory(categoryId));
    }


    //Create category
    @CacheEvict(
            cacheNames = "categories",
            allEntries = true
    )
    public CategoryResponseDTO createCategory(CategoryRequestDTO request) {
        String code = normalizeCode(request.getCode());
        if (categoryRepo.existsByCodeIgnoreCase(code)) {
            throw new ApiException("Category code already exists", HttpStatus.CONFLICT);
        }

        Category parent = findParent(request.getParentId());
        Category category = new Category();
        category.setName(request.getName()
                .trim());
        category.setCode(code);
        category.setParent(parent);
        category.setLevel(parent == null ? 0 : parent.getLevel() + 1);
        return toResponse(categoryRepo.save(category));
    }


    //Update category
    @CacheEvict(
            cacheNames = "categories",
            allEntries = true
    )
    public CategoryResponseDTO updateCategory(Long categoryId, CategoryRequestDTO request) {
        Category category = findCategory(categoryId);
        String code = normalizeCode(request.getCode());
        if (categoryRepo.existsByCodeIgnoreCaseAndIdNot(code, categoryId)) {
            throw new ApiException("Category code already exists", HttpStatus.CONFLICT);
        }
//
//        Category parent = findParent(request.getParentId());
//        if (parent != null && parent.getId()
//                .equals(categoryId)) {
//            throw new ApiException("A category cannot be its own parent", HttpStatus.BAD_REQUEST);
//        }
//        ensureParentIsNotDescendant(category, parent);

        category.setName(request.getName()
                .trim());
        category.setCode(code);

        return toResponse(categoryRepo.save(category));
    }

    //delete category
    public void deleteCategory(Long categoryId) {
        if (productRepo.existsByCategoryId(categoryId)) {
            throw new ApiException("Cannot delete a category that has products", HttpStatus.CONFLICT);
        }
        Category category = findCategory(categoryId);
        if (categoryRepo.existsByParentId(categoryId)) {
            throw new ApiException("Delete child categories before deleting this category", HttpStatus.CONFLICT);
        }
        if (productRepo.existsByCategoryId(categoryId)) {
            throw new ApiException("Cannot delete a category that has products", HttpStatus.CONFLICT);
        }
        categoryRepo.delete(category);
    }

    //Find category
    private Category findCategory(Long categoryId) {
        return categoryRepo.findById(categoryId)
                .orElseThrow(() -> new ApiException("Category not found", HttpStatus.NOT_FOUND));
    }


    //Find parent category
    private Category findParent(Long parentId) {
        return parentId == null ? null : findCategory(parentId);
    }

    //Ensure that the parent category is not a descendant of the category being updated
    private void ensureParentIsNotDescendant(Category category, Category parent) {
        Category current = parent;
        while (current != null) {
            if (current.getId()
                    .equals(category.getId())) {
                throw new ApiException("A category cannot be moved below one of its descendants", HttpStatus.BAD_REQUEST);
            }
            current = current.getParent();
        }
    }

    //Normalize category code
    private String normalizeCode(String code) {
        return code.trim()
                .toLowerCase()
                .replaceAll("\\s+", "-");
    }


    //Convert category entity to response DTO
    private CategoryResponseDTO toResponse(Category category) {

        return CategoryResponseDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .code(category.getCode())
                .children(new ArrayList<>())
                .level(category.getLevel())
                .build();
    }
}
