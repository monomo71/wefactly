# Data Model Notes

## Doel
Een stabiel, uitbreidbaar en logisch datamodel.

## Core entities
- Customer
- Product
- Quote
- QuoteLine
- Invoice
- InvoiceLine
- User
- Settings

## Factuurstatus
Facturen hebben altijd een status:
- draft
- sent
- paid
- overdue

## Nummering
Ondersteuning voor:
- factuurnummers
- offertennummers
- klantnummers

Format:
- prefix
- datum
- teller

## Adresstructuur
Niet hardcoded NL-only.

Voorbereid op:
- internationale adressen
- uitbreidbare velden

## Extensibility
Data model moet:
- uitbreidbare velden ondersteunen
- modules laten inhaken
- zonder core te breken

## Belangrijk
Core blijft relationeel en strak.
Geen rommelige JSON-opslag als basis.
