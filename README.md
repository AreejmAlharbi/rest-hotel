# Rest Hotel

A simple hotel reservation system:
- **Backend:** ASP.NET Core Web API (rooms, reservations, JWT auth, Azure Blob storage for images)
- **Frontend:** Angular (public pages + admin dashboard)



## Table of Contents
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
  - [1) Clone](#1-clone)
  - [2) Backend Setup](#2-backend-setup)
  - [3) Frontend Setup](#3-frontend-setup)
- [Backend `appsettings.Development.json`](#backend-appsettingsdevelopmentjson)
- [Frontend Proxy](#frontend-proxy)
- [API Overview (brief)](#api-overview-brief)


## Tech Stack
- **Backend:** ASP.NET Core (.NET 7/8), Entity Framework Core, JWT auth  
- **Frontend:** Angular 17+
- **Database:** SQL Server / LocalDB  
- **Storage:** Azure Blob Storage for room images




## Requirements
- **.NET SDK** 7 or 8 (`dotnet --version`)
- **SQL Server / LocalDB**
- **Node.js** 18+ (`node -v`)
- **Angular CLI** (`ng version`)
- **Azure Storage** (optional, only if using image uploads)

> Tip (Windows dev cert): `dotnet dev-certs https --trust`



## Quick Start

### 1) Clone
```bash
git clone https://github.com/AreejmAlharbi/rest-hotel.git
cd rest-hotel

cd Backend/RestHotelAPI
dotnet restore
```
### 2) Backend Setup
```
cd Backend/RestHotelAPI
dotnet restore
```
## Backend `appsettings.Development.json`
```
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=RestHotelDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  },  //apply your sql server account
  "Jwt": {
    "Key": "<PUT_A_SECURE_RANDOM_KEY>",
    "Issuer": "RestHotel",
    "Audience": "RestHotelUsers",
    "ExpireMinutes": 60
  },
  "AzureBlobSettings": {
    "ConnectionString": "<AZURE_BLOB_CONNECTION_STRING>",
    "ContainerName": "room-images"
  },
  "AllowedOrigins": [ "http://localhost:4200" ]
}
```

 Apply EF Core migrations and run:

 ```
 Add-Migration  InitialCreate
 Update-Dtabase
```

Run Backend:
```
dotnet run
 You'll see URLs like https://localhost:7052 (copy the HTTPS one)
```

### 3) Frontend Setup
```
cd Frontend
npm install
```

## Frontend Proxy
```
{
  "/api": {
    "target": "your backend URL",
    "secure": false,
    "changeOrigin": true
  }
}
```

Run the dev server:
```
ng serve --proxy-config your-proxy-file.json
 Open http://localhost:4200
```

## API Overview (brief)
_All endpoints are prefixed with `/api`._

### Rooms
- GET    /api/rooms
- POST   /api/rooms
- GET    /api/rooms/{id}
- PUT    /api/rooms/{id}
- DELETE /api/rooms/{id}
- GET    /api/rooms/available

### Reservations
- POST   /api/reservations
- GET    /api/reservations
- GET    /api/reservations/{id}
- PUT    /api/reservations/{id}
- PATCH  /api/reservations/{id}/cancel
- GET    /api/reservations/canceled
- GET    /api/reservations/mine

### Users
- POST   /api/users/register
- POST   /api/users/login

