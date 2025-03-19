using FluentResults;

namespace TSU.Vizit.Infrastructure.Errors;

public class NotFoundError : Error
{
    public NotFoundError(string message) : base(message)
    {
    }
}
