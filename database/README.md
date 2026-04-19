# Database

This folder contains the phase 1 database foundation for weFactly.

## Current scope
- migrations for organizations, users and settings
- seeds directory reserved for later use
- schema notes and backup/restore helpers

## Phase 1 principles
- PostgreSQL as the relational core
- clean separation between organization, user and settings
- central settings table for v1
- neutral field naming for international use
- metadata only where it already adds clear value
