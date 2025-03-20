using System.Collections;
using System.Globalization;
using CsvHelper;
using FluentResults;
using FluentResults.Extensions;
using FluentResults.Extensions.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TSU.Vizit.Application.Features.AbsenceRequests.Dto;
using TSU.Vizit.Application.Features.Users;
using TSU.Vizit.Application.Features.Users.Dto;
using TSU.Vizit.Application.Infrastructure.Auth;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features.CsvExport;

[ApiController]
[Authorize]
[Route("api/export")]
public class CsvExportController(
    UserAccessor _userAccessor,
    CsvExportService _csvExportService,
    UserService _userService) : Controller
{
    [HttpGet("absence_request/all")]
    [Produces("text/csv")]
    public async Task<IActionResult> ExportAbsenceRequests([FromQuery] ExportAllAbsenceRequestsModel model)
    {
        var data = await _userAccessor.GetUserId()
            .Bind(async Task<Result<List<AbsenceRequestDto>>> (userId) =>
                await _csvExportService.ExportAbsenceRequests(userId, model));

        return data.IsSuccess ? await ToCsv(data.Value) : data.ToActionResult();
    }

    [HttpGet("absence_request/mine")]
    [Produces("text/csv")]
    public async Task<IActionResult> ExportPersonalAbsenceRequests([FromQuery] ExportPersonalAbsenceRequestModel model)
    {
        var data = await _userAccessor.GetUserId()
            .Bind(async Task<Result<List<AbsenceRequestDto>>> (userId) =>
                await _csvExportService.ExportAbsenceRequests(userId, new ExportAllAbsenceRequestsModel
                {
                    CreatedById = userId,
                    FinalisedById = model.FinalisedById,
                    Reason = model.Reason,
                    FinalStatus = model.FinalStatus
                }));

        return data.IsSuccess ? await ToCsv(data.Value) : data.ToActionResult();
    }

    private async Task<IActionResult> ToCsv(List<AbsenceRequestDto> data)
    {
        using var memoryStream = new MemoryStream();
        await using var streamWriter = new StreamWriter(memoryStream);
        await using var csvWriter = new CsvWriter(streamWriter, CultureInfo.InvariantCulture);
        await csvWriter.WriteRecordsAsync((IEnumerable)data);
        await streamWriter.FlushAsync();
        memoryStream.Position = 0;

        return File(memoryStream.ToArray(), "text/csv", $"export-{DateTime.Now:yyyyMMddHHmmss}.csv");
    }
}
