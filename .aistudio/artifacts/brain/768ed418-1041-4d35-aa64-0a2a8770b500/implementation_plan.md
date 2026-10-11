# External ASP.NET Core & SQL Server Integration Plan

Connecting the MediGuide medical web platform with an external ASP.NET Core Web API backed by Microsoft SQL Server, enabling live clinical data synchronization with seamless local fallback.

### User Review & Critical Decisions

> [!IMPORTANT]
> The database connection strategy and display posture have been confirmed as follows:

- **Confirmed Decision 1 (Database Connection)**: Connect to an external ASP.NET Core Web API backed by Microsoft SQL Server (Entity Framework Core) rather than an in-app Cloud SQL PostgreSQL database.
- **Confirmed Decision 2 (Display & Layout)**: Keep the current responsive layout as is across mobile and desktop devices.
- **Resilient Fallback Policy**: If the external ASP.NET Core server or SQL Server instance is unreachable or offline, the app seamlessly falls back to the in-browser repository (`localStorage` + mock datasets) so neither mobile nor desktop users experience downtime or blank screens.

---

### 1. Overview & Core Concept

- **What It Does**: MediGuide provides clinical first-aid guidelines, verified medical articles, a directory of Egyptian clinical pioneers, video tutorials, and triage AI. This plan configures the client to connect directly to an external ASP.NET Core API communicating with Microsoft SQL Server.
- **Target Audience**: Medical students, doctors, healthcare workers, and general users accessing the platform on mobile and desktop.
- **Key Value**: Real-time synchronization of medical articles, doctor schedules, and user credentials with a relational SQL Server database, alongside a live connection inspector.

---

### 2. User Experience & Visual Design

- **Live Connection Inspector & Configuration**:
  - Accessible via the top navbar or admin panel: a dedicated modal/panel allowing the developer to input their ASP.NET Core API Base URL (default `https://localhost:7123/api` or hosted URL like `https://api.yourdomain.com`).
  - An interactive **Test Connection** button that checks `/health` and measures round-trip latency in milliseconds.
  - Clear visual indicator: green pulse for "Connected to SQL Server API", amber badge for "Local Repository Active (Offline Fallback)".
- **Visual Identity & Theme**:
  - Medical clinical aesthetic: deep teal (`#0d9488`), clean slate borders (`#e2e8f0`), soft background mesh, and crisp high-contrast typography (`Cairo` for Arabic RTL, `Plus Jakarta Sans` for English LTR).
  - Adheres to zero-pill discipline: metadata and connection statuses rendered with clean typography and hairline dividers.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual-Mode Architecture (Live API + Resilient Local Fallback)**
  - *Chosen Approach*: The frontend issues real `fetch` requests to ASP.NET Core endpoints. If the network request fails or times out, it transparently returns cached/local data without throwing unhandled exceptions.
  - *Why*: Enables developing and previewing the frontend anywhere (including cloud preview URLs) even if the local SQL Server is not exposed to the public internet.
  - *Alternatives Considered*: Strict live-only mode, which would cause errors whenever the local machine is powered off.

- **Decision 2: Configurable API Base URL in Browser Storage**
  - *Chosen Approach*: Persist the custom API Base URL in `localStorage`, pre-filled with `.env` default (`VITE_API_BASE_URL`).
  - *Why*: Allows switching between `localhost:7123`, a tunnel (like ngrok or dev tunnels), and a staging SQL server directly from the UI without rebuilding code.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                   MediGuide Frontend                   │
│         (React 19 + TypeScript + Vite + Tailwind)      │
└──────────────────────────┬─────────────────────────────┘
                           │
             HTTP / JSON (REST API Endpoints)
             Bearer JWT Authorization
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│                ASP.NET Core Web API                    │
│      Controllers: Articles, Doctors, Auth, Health      │
└──────────────────────────┬─────────────────────────────┘
                           │
             Entity Framework Core 8 / 9
             (ApplicationDbContext)
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│               Microsoft SQL Server                     │
│      Tables: Articles, Doctors, Users, Protocols       │
└────────────────────────────────────────────────────────┘
```

#### Core Endpoints & SQL Tables

| Entity | ASP.NET Core Endpoint | SQL Server Table | Key Fields |
|---|---|---|---|
| **Health** | `GET /health` | - | `status`, `databaseConnected`, `timestamp` |
| **Articles** | `GET /api/articles`<br>`POST /api/articles` | `MedicalArticles` | `Id`, `TitleAr`, `ContentAr`, `Specialty`, `Status` |
| **Doctors** | `GET /api/doctors` | `EgyptianDoctors` | `Id`, `NameAr`, `Specialty`, `Workplace`, `ClinicAddress` |
| **Auth** | `POST /api/auth/login`<br>`POST /api/auth/register` | `Users` | `Id`, `Email`, `PasswordHash`, `Role` |
| **Videos** | `GET /api/videos`<br>`POST /api/videos` | `MedicalVideos` | `Id`, `TitleAr`, `VideoUrl`, `Category` |

#### CORS & Connection Setup

In `Program.cs` on the ASP.NET Core project:
```csharp
builder.Services.AddCors(options => {
    options.AddPolicy("AllowMediGuide", policy => {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://ais-pre-afom473cjwrob7rvlq5cno-685881456527.europe-west1.run.app",
            "https://ais-dev-afom473cjwrob7rvlq5cno-685881456527.europe-west1.run.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});
```

---

### 5. Implementation Steps

1. **Connection Inspector Modal**: Build a clean modal in `src/components/common/ApiConnectionModal.tsx` to configure and test the live ASP.NET Core URL.
2. **Enhanced API Service (`src/services/api.ts`)**: Ensure all doctor, article, video, and auth services attempt the live ASP.NET Core endpoint with automatic fallback.
3. **C# Reference Pack in Admin / Docs**: Provide copyable `DbContext`, Controller, and SQL Migration scripts in the platform's developer reference view for easy copy-paste into Visual Studio.
4. **Verification & Build**: Compile applet and verify zero errors across mobile and desktop viewports.
