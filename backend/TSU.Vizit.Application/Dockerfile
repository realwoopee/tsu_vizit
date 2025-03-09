FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER 1000
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["TSU.Vizit.Application/TSU.Vizit.Application.csproj", "TSU.Vizit.Application/"]
COPY ["TSU.Vizit.Contracts/TSU.Vizit.Contracts.csproj", "TSU.Vizit.Contracts/"]
COPY ["TSU.Vizit.Domain/TSU.Vizit.Domain.csproj", "TSU.Vizit.Domain/"]
COPY ["TSU.Vizit.Infrastructure/TSU.Vizit.Infrastructure.csproj", "TSU.Vizit.Infrastructure/"]
COPY ["TSU.Vizit.Persistence/TSU.Vizit.Persistence.csproj", "TSU.Vizit.Persistence/"]
RUN dotnet restore "TSU.Vizit.Application/TSU.Vizit.Application.csproj"
COPY . .
WORKDIR "/src/TSU.Vizit.Application"
RUN dotnet build "TSU.Vizit.Application.csproj" -c $BUILD_CONFIGURATION --no-restore -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "TSU.Vizit.Application.csproj" -c $BUILD_CONFIGURATION --no-build -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TSU.Vizit.Application.dll"]
