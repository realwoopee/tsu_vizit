using FluentResults;

namespace TSU.Vizit.Application.Infrastructure.Auth;

public class TokenServiceError : Error
{
    public TokenServiceError(string message) : base(message)
    {
    }
}
