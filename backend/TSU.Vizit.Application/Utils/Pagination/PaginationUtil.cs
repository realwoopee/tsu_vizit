using TSU.Vizit.Contracts.Utils;

namespace TSU.Vizit.Application.Utils.Pagination;

public static class PaginationUtil
{
    public static IQueryable<T> Paginate<T>(this IQueryable<T> query, PaginationModel pagination)
    {
        return query
            .Skip(pagination.Offset)
            .Take(pagination.Limit);
    }
}
