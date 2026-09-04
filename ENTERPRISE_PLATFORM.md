# EPIC 6 - API & ENTERPRISE PLATFORM

## Objetivo

Preparar Sportiva24 para clientes profesionales mediante una plataforma de API enterprise-ready.

Este EPIC define arquitectura tecnica, contratos y politicas operativas.
No incluye comercializacion.

## Alcance Implementado

Arquitectura preparada para:

- API Publica
- API Premium
- White Label
- Licenciamiento
- Clientes Enterprise

## Modulo Tecnico

Se implemento el modulo:

- `lib/enterprise-platform/types.ts`
- `lib/enterprise-platform/contracts.ts`
- `lib/enterprise-platform/auth.ts`
- `lib/enterprise-platform/versioning.ts`
- `lib/enterprise-platform/rateLimits.ts`
- `lib/enterprise-platform/licensing.ts`
- `lib/enterprise-platform/whiteLabel.ts`
- `lib/enterprise-platform/platform.ts`
- `lib/enterprise-platform/index.ts`

## Definiciones Clave

### 1) Autenticacion

Estrategias formalizadas por superficie:

- API Publica: api-key
- API Premium: jwt-bearer
- API Enterprise: oauth2-client-credentials
- White Label: signed-request + tenant obligatorio

Scopes definidos para control de acceso:

- analysis:read
- center:read
- knowledge-graph:read
- premium:access
- enterprise:access
- tenant:brand

Funcion de evaluacion:

- `evaluateEndpointAccess(endpoint, context)`

### 2) Versionado

Politica semver definida por contrato y endpoint:

- major.minor.patch
- fallback por misma major cuando version exacta no existe
- capacidad para version pinning por cliente

Funcion de resolucion:

- `resolveBestVersion(available, requested)`

### 3) Limites

Perfiles de rate limit definidos:

- public-default
- premium-analytics
- enterprise-dedicated
- white-label-dedicated

Cada perfil define:

- burst
- ventana sostenida (requests/period)
- cuota diaria

Funcion de evaluacion:

- `evaluateRateLimit(profile, state)`

### 4) Contratos

Contratos base versionados:

- s24-match-analysis
- s24-intelligence-center
- s24-knowledge-graph

Registro de endpoints por superficie:

- `/api/public/v1/...`
- `/api/premium/v1/...`
- `/api/enterprise/v1/...`
- `/api/white-label/v1/...`

Cada endpoint define:

- contrato
- auth policy
- rate limit profile
- tiers permitidos
- SLA objetivo

### 5) White Label

Modelo de branding por tenant:

- tenantId
- brandName
- logo
- colores
- dominio custom
- locale

Funciones:

- `normalizeWhiteLabelBranding`
- `validateWhiteLabelBranding`

### 6) Licenciamiento

Politicas de licencia por tier:

- community
- premium
- enterprise
- white-label

Cada tier define:

- capacidades habilitadas
- maxTenants
- maxApiKeys
- maxContractPins

Funcion:

- `resolveLicensePolicy(tier)`

## Especificacion Consolidada

Funcion principal para exposicion de la plataforma:

- `buildEnterprisePlatformSpec()`

Retorna:

- superficies soportadas
- contratos
- scopes
- endpoint registry
- rate-limit profiles
- license policies

## Consumo Previsto

Esta plataforma queda preparada para integrarse con:

- API Gateway
- middleware de autenticacion/autorizacion
- store de counters para rate limiting
- portal de desarrolladores
- auditoria y observabilidad

## No Incluido En Este EPIC

- Facturacion
- Cobro
- Pricing
- Sales CRM
- Flujos comerciales

Solo se prepara la base tecnica de plataforma enterprise.
