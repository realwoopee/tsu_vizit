using FluentResults;

namespace TSU.Vizit.Infrastructure.Errors;

public class AuthError : Error
{
    public AuthError(string message) : base(message)
    {
    }
}
