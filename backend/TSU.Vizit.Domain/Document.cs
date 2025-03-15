using System.Reflection.Metadata;

namespace TSU.Vizit.Domain;

public class Document
{
    public Document()
    {
        Id = Guid.NewGuid();
    }
    public Guid Id { get; set; } 
    public Guid AbsenceRequestId { get; set; }
    public byte[] Attachment { get; set; }
}
