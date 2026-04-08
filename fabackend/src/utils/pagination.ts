export interface PaginationParams{
    page: number;
    limit: number;
}

export interface PaginatedResponse<T>{
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export const getPaginationParams = (
    query: Record<string, unknown>
): PaginationParams=>{
    const page = Math.max(1, parseInt(query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, Math.max(1, parseInt(query.limit as string) || 10)));
    return { page, limit};
};

export const calculatePagination = ( 
    total: number,
    page: number,
    limit: number
) =>{
    return {
        total, page, limit, pages: Math.ceil(total/limit)
    };
};

export const getPaginationOffset = (page: number, limit: number): number =>{
    return (page -1) * limit;
}