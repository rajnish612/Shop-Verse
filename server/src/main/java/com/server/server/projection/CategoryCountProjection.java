package com.server.server.projection;

public interface CategoryCountProjection {
    Long getRootCount();

    Long getNestedCount();
}
