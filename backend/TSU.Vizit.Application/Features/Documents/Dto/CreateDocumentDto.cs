namespace TSU.Vizit.Application.Features.Documents.Dto;

public class CreateDocumentDto
{
    public string Title { get; set; }
    public Guid AbsenceRequestId { get; set; }
    public byte[] Attachment { get; set; }
}
