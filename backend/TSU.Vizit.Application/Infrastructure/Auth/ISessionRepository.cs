using FluentResults;

namespace TSU.Vizit.Application.Infrastructure.Auth;

public interface ISessionRepository
{
    IList<Session> GetSessions(Guid userId);
    Result<Session> GetSession(Guid sessionId);
    Session CreateNewSession(Guid userId, TimeSpan lifetime);
    Result DeleteSession(Guid sessionId, Guid userId);
    void ClearSessions(Guid userId);
    Result UpdateRefreshToken(Guid sessionId, string refreshToken, DateTime expiresAt);
}