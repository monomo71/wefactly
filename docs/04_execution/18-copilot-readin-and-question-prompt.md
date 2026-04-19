# 18-copilot-readin-and-question-prompt.md

Gebruik deze prompt als allereerste briefing in Copilot of een andere code-agent.

---

Je werkt aan **weFactly**, een modern facturatieplatform.

Voordat je code schrijft, moet je jezelf eerst **inlezen in het project** en daarna **gerichte vragen stellen** om onduidelijkheden weg te nemen.

## Stap 1 — Eerst inlezen

Lees eerst deze documenten in deze volgorde:

1. `README.md`
2. `docs/00_context/00-project-reset-v1.md`
3. `docs/01_foundation/01-product-philosophy.md`
4. `docs/01_foundation/02-scope-v1.md`
5. `docs/01_foundation/03-out-of-scope.md`
6. `docs/02_product/04-modular-vision.md`
7. `docs/02_product/06-ui-ux-principles.md`
8. `docs/03_architecture/05-technical-direction.md`
9. `docs/03_architecture/07-data-model-notes.md`
10. `docs/03_architecture/13-database-architecture.md`
11. `docs/03_architecture/14-security-and-backups.md`
12. `docs/04_execution/08-build-order.md`
13. `docs/05_growth/10-roadmap.md`

## Stap 2 — Vat daarna eerst samen

Geef daarna eerst een korte maar concrete samenvatting van:
- wat weFactly is
- wat v1 precies bevat
- wat bewust nog niet in v1 zit
- welke technische richting is gekozen
- welke UX-regels altijd leidend zijn
- hoe modules later mogen uitbreiden
- wat de bouwvolgorde is

## Stap 3 — Stel daarna vragen

Stel daarna **alleen de meest noodzakelijke vragen** die nodig zijn om goed te starten.

Belangrijke regels:
- stel vragen **1 voor 1**
- stel geen vragen waarop het antwoord al in de documenten staat
- stel geen overbodige of theoretische vragen
- stel alleen vragen die invloed hebben op ontwerp, structuur of uitvoering
- als iets al redelijk vastligt, ga daar dan van uit
- respecteer altijd de projectfilosofie: **duidelijkheid boven flexibiliteit**

## Stap 4 — Denk als architect, niet als feature-generator

Belangrijk:
- probeer niet meteen alles te bouwen
- probeer niet slim te zijn met extra features buiten scope
- probeer niet de scope groter te maken
- bewaak de structuur, UX en uitbreidbaarheid
- geef aan waar je risico’s ziet op herschrijven of overcomplexiteit

## Stap 5 — Na de vragen pas een voorstel doen

Pas nadat je de eerste noodzakelijke vragen hebt gesteld en antwoord hebt gekregen, mag je een voorstel doen voor:
- eerste projectsetup
- mapstructuur
- eerste buildstap

## Harde projectregels

- weFactly start als **single-tenant**
- maar moet **SaaS-aware** ontworpen worden
- basis wordt **open source**
- self-hosted distributie via **Docker**
- database is **PostgreSQL**
- veiligheid en backupbaarheid zijn basisvoorwaarden
- UX is kern, geen afwerking
- modules mogen uitbreiden, maar niet verstoren
- nieuwe features mogen geen reden zijn om core te herschrijven

## Verwachte werkwijze van jou

Werk in dit ritme:
1. inlezen
2. samenvatten
3. 1 gerichte vraag
4. antwoord verwerken
5. volgende vraag
6. pas daarna voorstel / code

Begin nu met **inlezen en samenvatten**, nog zonder code te schrijven.
