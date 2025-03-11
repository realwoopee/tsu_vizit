
using TSU.Vizit.Application.Utils.Pagination.Dto;
using TSU.Vizit.Domain.Paginaiton;

namespace TSU.Vizit.Application.Utils.Pagination;

public static class PaginationUtil
{
    public static IQueryable<T> Paginate<T>(this IQueryable<T> query, PaginationModel pagination)
    {
        return query
            .Skip((pagination.Page - 1) * pagination.Size)
            .Take(pagination.Size);
    }

    public static PaginationDto ToDto(this PaginationModel pagination, int totalCount)
    {
        return new PaginationDto
        {
            Size = pagination.Size, Current = pagination.Page,
            Count = (int)Math.Ceiling((double)totalCount / pagination.Size)
        };
    }
}