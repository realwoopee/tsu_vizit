using FluentResults;

namespace TSU.Vizit.Infrastructure.Errors;

public class ValidationError : Error
{
    public ValidationError(string message) : base(message)
    {
    }
}
