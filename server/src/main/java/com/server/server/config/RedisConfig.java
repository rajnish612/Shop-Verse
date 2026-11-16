package com.server.server.config;
import com.server.server.dto.AttributeResponseDTO;
import com.server.server.dto.CategoryResponseDTO;
import com.server.server.dto.ProductResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.cache.autoconfigure.RedisCacheManagerBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.serializer.JacksonJsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import tools.jackson.databind.JavaType;
import tools.jackson.databind.type.TypeFactory;

import java.time.Duration;
import java.util.List;

//Time to live (TTL) for cache
@Configuration
public class RedisConfig {

    @Bean
    public RedisCacheManagerBuilderCustomizer redisCacheCustomizer(
            @Value("${spring.cache.redis.time-to-live:10m}") Duration ttl) {

        // Common configuration
        RedisCacheConfiguration baseConfig =
                RedisCacheConfiguration.defaultCacheConfig()
                        .entryTtl(ttl)
                        .disableCachingNullValues()
                        .serializeKeysWith(
                                RedisSerializationContext.SerializationPair
                                        .fromSerializer(new StringRedisSerializer())
                        );

        // Product details: single ProductResponseDTO
        RedisCacheConfiguration productConfig =
                baseConfig.serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(
                                        new JacksonJsonRedisSerializer<>(
                                                ProductResponseDTO.class
                                        )
                                )
                );

        // Categories: List<CategoryResponseDTO>
        RedisCacheConfiguration categoryConfig =
                baseConfig.serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(
                                        listSerializer(CategoryResponseDTO.class)
                                )
                );

        // Attributes: List<AttributeResponseDTO>
        RedisCacheConfiguration attributeConfig =
                baseConfig.serializeValuesWith(
                        RedisSerializationContext.SerializationPair
                                .fromSerializer(
                                        listSerializer(AttributeResponseDTO.class)
                                )
                );

        return builder -> builder
                .withCacheConfiguration("productDetails", productConfig)
                .withCacheConfiguration("categories", categoryConfig)
                .withCacheConfiguration("attributes", attributeConfig);
    }

    // Creates a serializer for a strongly typed List
    private <T> RedisSerializer<List<T>> listSerializer(Class<T> elementType) {

        JavaType listType = TypeFactory.createDefaultInstance()
                .constructCollectionType(List.class, elementType);

        return new JacksonJsonRedisSerializer<>(listType);
    }
}
