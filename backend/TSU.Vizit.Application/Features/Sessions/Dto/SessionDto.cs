using TSU.Vizit.Application.Infrastructure.Auth;

namespace TSU.Vizit.Application.Features.Dto;

public class SessionDto
{
    public Guid Id { get; set; }

    public string LastIp { get; set; }

    public DateTime ExpiresAfter { get; set; }
}

public static class SessionDtoExtensions
{
    public static SessionDto ToDto(this Session session)
    {
        return new SessionDto
        {
            Id = session.Id,
            LastIp = session.LastIp,
            ExpiresAfter = session.ExpiresAfter
        };
    }
}