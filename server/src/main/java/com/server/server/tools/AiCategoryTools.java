package com.server.server.tools;

import com.server.server.dto.CategoryResponseDTO;
import com.server.server.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AiCategoryTools {

    private final CategoryService categoryService;

    @Tool(description = """
            Retrieve all available product categories from the database,
            including nested categories.
            
            Use this tool when a customer mentions a category by name
            and you need to identify its actual database ID.
            
            Never invent category IDs.
            """)
    public List<CategoryResponseDTO> getCategories() {

        List<CategoryResponseDTO> result = new ArrayList<>();

        for (CategoryResponseDTO category : categoryService.getAllCategories()) {
            flattenCategories(category, result);
        }

        return result;
    }

    private void flattenCategories(
            CategoryResponseDTO category,
            List<CategoryResponseDTO> result
    ) {
        result.add(category);

        if (category.getChildren() != null) {
            for (CategoryResponseDTO child : category.getChildren()) {
                flattenCategories(child, result);
            }
        }
    }
}
