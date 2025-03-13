using FluentResults.Extensions.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TSU.Vizit.Application.Features.Documents.Dto;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.Documents;

[ApiController]
[Authorize]
[Route("api/document")]
public class DocumentController(DocumentService _documentService) : ControllerBase
{
    [HttpPost("attach")]
    public async Task<ActionResult<Document>> AttachDocument(AttachDocumentDto dto)
    {
        return await _documentService.CreateDocument(dto).ToActionResult();
    }
}
