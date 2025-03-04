using FluentResults;

namespace TSU.Vizit.Infrastructure.Errors;

public class ForbiddenError : Error
{
    public ForbiddenError(string message) : base(message)
    {
    }
}