namespace TSU.Vizit.Application.Features.Documents.Dto;

public class DocumentDto
{
    public Guid Id { get; set; }
    public Guid AbsenceRequestId { get; set; }
    public byte[] Attachment { get; set; }
}
