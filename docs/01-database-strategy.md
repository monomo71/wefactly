# Wefactly Architectuur & Database Strategie

## 1. Project Doelstelling: Twee Edities (OSS vs SaaS)
Wefactly wordt ontwikkeld als één codebase die twee verschillende oplossingen faciliteert:
1. **Open Source Editie (Standalone):** Een self-hosted variant die gebruikers via een Docker-container kunnen draaien.
2. **SaaS Editie (Multi-tenant):** Een door onszelf gehoste cloudoplossing met abonnementen en meerdere organisaties.

## 2. Database Techniek
Om beide edities Optimaal te ondersteunen, scheiden we de backends per editie:

* **PostgreSQL (Voor Open Source / Standalone Docker):** 
  Een krachtige, betrouwbare, en ACID-compliant database. Perfect voor lokaal hosten en extreem strikt met financiële datatypes (cruciaal voor facturatiepakketten).
  
* **Appwrite (Voor de SaaS Editie):** 
  Een Backend-as-a-Service die perfect past bij ons cloud-model. Deze regelt authenticatie, database (document storage), en bestandopslag. Het grootste voordeel is dat we **Appwrite Teams** en **Document-Level Security** kunnen gebruiken voor een veilige, schaalbare multi-tenant (SaaS) structuur.

## 3. Architectuur Patroon: Het Repository Pattern
Omdat PostgreSQL relationeel is en Appwrite met NoSQL documenten werkt, zorgen we voor een harde ontkoppeling tussen de 'frontend/UI' en de 'database'.

We gebruiken het **Repository Pattern (Ports & Adapters)**:

### A. Interfaces (Het Contract)
We definiëren abstracte TypeScript interfaces voor elke data-entiteit (bijv. in `src/types/domain.ts`), zodat de UI weet welke functies beschikbaar zijn zonder de onderliggende database te kennen.
```typescript
export interface InvoiceRepository {
  getById(id: string): Promise<Invoice | null>;
  create(data: Omit<Invoice, 'id'>): Promise<Invoice>;
  list(tenantId?: string): Promise<Invoice[]>;
}
```

### B. Drie Implementaties (De Motoren)
Voor elke module (zoals facturen, klanten, instellingen) schrijven we drie aparte datalagen (in `src/lib/db/`):
1. **Mock Repo:** (`mock-invoice-repo.ts`) → Opslag in het werkgeheugen / localStorage. Handig om snel UI's te bouwen en te testen zonder database.
2. **Postgres Repo:** (`postgres-invoice-repo.ts`) → De backend logic voor de Docker Open Source versie.
3. **Appwrite Repo:** (`appwrite-invoice-repo.ts`) → De SDK koppeling met onze SaaS Appwrite omgeving.

### C. Dependency Injection (Dynamisch Inladen)
Aan de hand van configuratie (zoals `.env` met `VITE_APP_EDITION=saas` of `oss`) laden we de juiste engine in. De UI roept daardoor alleen `db.invoices.create()` aan, zonder om te hoeven kijken naar de actieve applicatieversie.

## 4. Richtlijnen voor verdere ontwikkeling
1. **Auth Scheiden:** Login en registratie via een abstracte `AuthProvider` (Appwrite Auth vs Lokale Auth).
2. **Storage Scheiden:** Opslaan van PDF-facturen via een generieke `StorageProvider` (Appwrite Storage vs Local Disk).
3. **Eerste stap is Mocking:** We bouwen de frontend modules altijd in eerste instantie tegen `Mock` Repositories, zodat het design, layout en router perfect werkt, waarna we de backend-logica stapsgewijs inpluggen.