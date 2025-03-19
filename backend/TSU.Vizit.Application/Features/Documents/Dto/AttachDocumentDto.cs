using System.ComponentModel.DataAnnotations;

namespace TSU.Vizit.Application.Features.Documents.Dto;

public class AttachDocumentDto
{
    [Required] public Guid AbsenceRequestId { get; set; }
    [Required] public byte[] Attachment { get; set; }
}
