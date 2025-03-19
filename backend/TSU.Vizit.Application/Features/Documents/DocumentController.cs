using FluentResults;
using FluentResults.Extensions.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TSU.Vizit.Application.Features.Documents.Dto;
using TSU.Vizit.Application.Infrastructure.Auth;
using TSU.Vizit.Domain;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features.Documents;

[ApiController]
[Authorize]
[Route("api/document")]
public class DocumentController(DocumentService _documentService, UserAccessor _userAccessor) : ControllerBase
{
    [HttpPost("/api/absence/{absenceId}/attach")]
    public async Task<ActionResult<Document>> AttachDocument(Guid absenceId, IFormFile file)
    {
        var curUserId = _userAccessor.GetUserId();
        using var memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);
        
        return await _documentService.CreateDocument(absenceId, memoryStream.ToArray(), curUserId.Value).ToActionResult();
    }
    
    [HttpDelete("/api/absence/{docId}/delete")]
    public async Task<ActionResult> DeleteDocument(Guid docId)
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result> (userId) => await _documentService.DeleteDocument(docId, userId))
            .ToActionResult();
    }
}
