# Database Architecture

## Doel
Een veilige, betrouwbare en uitbreidbare database.

## Database keuze
PostgreSQL

Waarom:
- sterk relationeel
- betrouwbaar
- goed voor self-hosting
- schaalbaar voor SaaS

## Structuur
Core tabellen:
- users
- customers
- products
- quotes
- quote_lines
- invoices
- invoice_lines
- settings

## Regels
- duidelijke relaties
- geen dubbele data
- consistente naming

## Backup
Moet altijd mogelijk zijn:
- volledige dump
- restore testbaar

## Voorbereid op SaaS
- tenant-id mogelijk in toekomst
- scheiding per gebruiker/bedrijf
- geen harde aannames in code

## Belangrijk principe
> De database moet stabiel blijven terwijl het product groeit.
