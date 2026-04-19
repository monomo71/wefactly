# Technical Direction

## Overzicht
weFactly wordt gebouwd als:
- Single-tenant applicatie (v1)
- SaaS-aware architectuur
- Modulair uitbreidbaar
- Self-hosted vriendelijk
- Voorbereid op internationale uitbreiding

## Architectuurstrategie
### Fase 1 (v1)
- Single-tenant
- Lokale database
- Self-hosted mogelijk via Docker

### Fase 2+
- Voorbereiding op multi-tenant
- SaaS uitbreidbaar
- Externe services mogelijk (zoals Appwrite)

## Belangrijk principe
> Bouw simpel, maar met duidelijke grenzen.

## Stack (voorstel)
Frontend:
- React
- Vite
- Tailwind

Componenten:
- Basis op chadcn (aangepast naar eigen stijl)

Backend:
- Node.js / API layer
- Later uitbreidbaar naar SaaS services

Database:
- PostgreSQL

## Architectuurregels
- Scheiding tussen:
  - UI
  - business logic
  - data access

- Geen logica in UI componenten
- Geen directe database calls vanuit frontend

## SaaS voorbereiding
Hoewel v1 single-tenant is:
- code moet voorbereid zijn op tenant-context
- geen aannames dat er maar 1 gebruiker bestaat
- scheiding tussen gebruiker en data

## Integraties (later)
Voor SaaS kan gebruik worden gemaakt van:
- auth systemen
- storage services
- externe API’s

Bijvoorbeeld: Appwrite voor auth en storage (later fase)
