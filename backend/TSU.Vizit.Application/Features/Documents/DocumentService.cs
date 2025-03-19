using System.Net.Mime;
using FluentResults;
using FluentResults.Extensions;
using FluentResults.Extensions.AspNetCore;
using TSU.Vizit.Application.Features.Documents.Dto;
using TSU.Vizit.Application.Features.Users;
using TSU.Vizit.Contracts.AbsenceRequests;
using TSU.Vizit.Contracts.Documents;
using TSU.Vizit.Domain;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features.Documents;

public class DocumentService(
    IDocumentRepository _documentRepository,
    IAbsenceRequestRepository _absenceRequestRepository,
    UserService _userService)
{
    public async Task<Result<DocumentDto>> GetDocument(Guid id, Guid curUserId)
    {
        var curUserPermissions = await _userService.GetUserPermissions(curUserId);
        var curUser = await _userService.GetUserById(curUserId);

        if (curUserPermissions.IsFailed)
            return CustomErrors.NotFound("Could not get user permissions.");
        
        if (curUser.IsFailed)
            return CustomErrors.NotFound("User not found.");

        var document = await _documentRepository.GetDocumentById(id);
        
        if (document.IsFailed)
            return CustomErrors.NotFound("Document not found.");
        
        var parentAbsenceRequest = await _absenceRequestRepository.GetAbsenceRequestById(document.Value.AbsenceRequestId);
        
        if (parentAbsenceRequest.IsFailed)
            return CustomErrors.NotFound("Absence request not found.");
        
        if (!curUserPermissions.Value.CanCheck && curUser.Value.Id != parentAbsenceRequest.Value.CreatedById)
            return CustomErrors.Forbidden("User does not have permission to get this document.");
        
        

        return Result.Ok(document.Value.ToDto());
    }
    
    public async Task<Result<DocumentDto>> CreateDocument(Guid absenceRequestId, byte[] data, Guid curUserId)
    {
        var absenceRequest = await _absenceRequestRepository.GetAbsenceRequestById(absenceRequestId);

        if (absenceRequest.IsFailed)
            return Result.Fail(absenceRequest.Errors);

        var userPermissions = await _userService.GetUserPermissions(curUserId);
        if (userPermissions.IsFailed)
            return Result.Fail(userPermissions.Errors);

        if (!userPermissions.Value.IsAdmin && absenceRequest.Value.CreatedById != curUserId)
            return CustomErrors.Forbidden("You can not attach documents to this absence request.");

        var document = new Document
        {
            AbsenceRequestId = absenceRequestId,
            Attachment = data
        };
        return (await _documentRepository.CreateDocument(document)).Map(doc => doc.ToDto());
    }

    public async Task<Result> DeleteDocument(Guid docId, Guid curUserId)
    {
        var document = await _documentRepository.GetDocumentById(docId);

        if (document.IsFailed)
            return CustomErrors.NotFound("Document not found.");

        var absRequest = await _absenceRequestRepository.GetAbsenceRequestById(document.Value.AbsenceRequestId);
        if (absRequest.IsFailed)
            return Result.Fail(absRequest.Errors);

        var userPermissions = await _userService.GetUserPermissions(curUserId);
        if (userPermissions.IsFailed)
            return Result.Fail(userPermissions.Errors);

        return await Result.FailIf(!(userPermissions.Value.IsAdmin || absRequest.Value.CreatedById == curUserId),
                new ForbiddenError("User does not have permission to delete document"))
            .Bind(async Task<Result> () => await _documentRepository.DeleteDocumentById(docId));
    }
}
