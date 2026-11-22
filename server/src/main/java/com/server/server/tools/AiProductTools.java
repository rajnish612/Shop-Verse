package com.server.server.tools;

import com.server.server.dto.ProductResponseDTO;
import com.server.server.service.CategoryService;
import com.server.server.service.ProductAttributeService;
import com.server.server.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.model.ToolContext;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.atomic.AtomicReference;

@Component
@RequiredArgsConstructor
public class AiProductTools {
    private final ProductService productService;
    private final CategoryService categoryService;
    private final ProductAttributeService productAttributeService;

    @Tool(description = """
            Search products in the ecommerce database using multiple filters.
            
            Extract only filters explicitly requested by the customer.
            Use null for filters that the customer did not specify.
            
            Available filters:
            
            1. keyword:
               Product name or type.
               Example: laptops, shirts, headphones.
            
            2. categoryNames:
               Names of product categories.
               Example: Electronics, Clothing.
            
            3. minPrice:
               Minimum price in INR.
            
            4. maxPrice:
               Maximum price in INR.
            
            5. minRating:
               Minimum customer rating.
            
            6. inStock:
               true for available products.
               false for out-of-stock products.
            
            7. stockMin:
               Minimum stock quantity.
            
            8. stockMax:
               Maximum stock quantity.
            
            9. requestedAttributes:
                Map where the key is the attribute name
                and the value is a list of requested values.
            
                Examples:
                {"Color": ["Black"]}
                {"Size": ["M"]}
                {"RAM": ["16GB"]}
                {"Size": ["M", "L"], "Color": ["Black", "Blue"]}
            
            Never invent category names or attribute values.
            Never invent product information.
            Only return products retrieved from the database.
            """)
    public List<ProductResponseDTO> searchProducts(

            @ToolParam(description = "Product name or type. Null if unspecified.", required = false)
            String keyword,

            @ToolParam(
                    description = "Product category names mentioned by the customer, such as Electronics, Clothing, or Home Appliances. Use null if unspecified.",
                    required = false
            )
            Set<String> categoryNames,
            @ToolParam(description = "Minimum price in INR.", required = false)
            BigDecimal minPrice,

            @ToolParam(description = "Maximum price in INR.", required = false)
            BigDecimal maxPrice,

            @ToolParam(description = "Minimum customer rating.", required = false)
            Double minRating,

            @ToolParam(description = "In-stock filter: true, false, or null.", required = false)
            Boolean inStock,

            @ToolParam(description = "Minimum stock quantity.", required = false)
            Integer stockMin,

            @ToolParam(description = "Maximum stock quantity.", required = false)
            Integer stockMax,

            @ToolParam(
                    description = """
                            Map of product attribute names to lists of requested values.
                            
                            Key = attribute name.
                            Value = list of requested attribute values.
                            
                            Examples:
                            {"Size": ["S", "M"]}
                            {"Color": ["Black", "Blue"]}
                            {"Size": ["S", "M"], "Color": ["Black", "Blue"]}
                            
                            If multiple values are requested for the same attribute,
                            include all of them in the list.
                            
                            Never omit explicitly requested values.
                            Never invent attribute names or values.
                            Use null if no attributes were specified.
                            """,
                    required = false
            )
            Map<String, List<String>> requestedAttributes,
            ToolContext toolContext
    ) {

        Set<Long> categoryIds = null;

        Object result = toolContext.getContext()
                .get("productResults");

        if (!(result instanceof AtomicReference<?> reference)) {
            throw new IllegalStateException("Product results reference not found in ToolContext");
        }

        @SuppressWarnings("unchecked")
        AtomicReference<List<ProductResponseDTO>> productResults =
                (AtomicReference<List<ProductResponseDTO>>) reference;
        productResults.set(List.of());
        if (categoryNames != null && !categoryNames.isEmpty()) {
            categoryIds = new HashSet<>(
                    categoryService.findCategoryIdsByNames(categoryNames)
            );

            if (categoryIds.isEmpty()) {
                System.out.println("No matching categories found.");
                return List.of();
            }
        }
        System.out.println("Final Category IDs: " + categoryIds);

        Set<Long> attributeValueIds = null;

        if (requestedAttributes != null && !requestedAttributes.isEmpty()) {

            List<Long> resolvedIds =
                    productAttributeService.findAttributeValueIds(requestedAttributes);

            System.out.println("Resolved Attribute Value IDs: " + resolvedIds);

            // Every requested attribute must have a matching database value.
            if (resolvedIds.isEmpty()) {
                System.out.println("Some requested attributes were not found.");
                return List.of();
            }

            attributeValueIds = new HashSet<>(resolvedIds);
        }

        System.out.println("Final Attribute Value IDs: " + attributeValueIds);
        List<ProductResponseDTO> products = productService.getAllProducts(
                        keyword,
                        categoryIds,
                        minPrice,
                        maxPrice,
                        minRating,
                        true,
                        stockMin,
                        stockMax,
                        attributeValueIds,
                        PageRequest.of(0, 10)
                )
                .getContent();

        productResults.set(products);
        return products;
    }
}
