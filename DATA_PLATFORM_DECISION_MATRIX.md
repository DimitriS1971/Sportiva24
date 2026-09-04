# DATA PLATFORM DECISION MATRIX - SPORTIVA24

## 1. Objetivo

Traducir la arquitectura de datos conceptual de Sportiva24 a una matriz de decisiones ejecutable, comparando opciones por capa con foco en:

- costo
- complejidad operativa
- time-to-market
- riesgo técnico
- escalabilidad futura

Alcance: diseño de decisión, sin imponer implementación inmediata ni modificar el runtime actual.

## 2. Escala De Referencia

### Costo (CAPEX/OPEX relativo)

- Bajo
- Medio
- Alto

### Complejidad Operativa

- Baja
- Media
- Alta

### Time-To-Market

- Rápido (0-8 semanas)
- Medio (2-4 meses)
- Largo (5+ meses)

### Riesgo Técnico

- Bajo
- Medio
- Alto

## 3. Matriz Ejecutiva Por Capa

## 3.1 Ingesta

| Opción | Descripción | Costo | Complejidad | Time-to-market | Riesgo | Pros | Contras |
|---|---|---|---|---|---|---|---|
| A | Pull scheduler básico con failover por proveedor (evolución del estado actual) | Bajo | Baja | Rápido | Medio | Menor fricción, aprovecha arquitectura existente | Menor capacidad near-real-time |
| B | Híbrido pull + webhooks con cola intermedia | Medio | Media | Medio | Bajo-Medio | Mejor frescura de datos y resiliencia | Mayor coordinación de contratos de entrada |
| C | Streaming-first full event ingestion | Alto | Alta | Largo | Medio-Alto | Máxima escalabilidad y baja latencia | Sobredimensionado para etapa inicial |

Recomendación: B progresiva, empezando por A endurecida.

## 3.2 Normalización

| Opción | Descripción | Costo | Complejidad | Time-to-market | Riesgo | Pros | Contras |
|---|---|---|---|---|---|---|---|
| A | Adapters por proveedor/deporte con validaciones mínimas | Bajo | Baja | Rápido | Medio | Entrega rápida y simple | Calidad heterogénea a escala |
| B | Pipeline de normalización con reglas de calidad y deduplicación | Medio | Media | Medio | Bajo-Medio | Mayor consistencia y trazabilidad | Requiere gobierno de reglas |
| C | Motor de resolución semántica avanzado + matching probabilístico | Alto | Alta | Largo | Medio | Muy robusto para 500 competiciones | Alto esfuerzo inicial |

Recomendación: B.

## 3.3 Persistencia Operacional

| Opción | Descripción | Costo | Complejidad | Time-to-market | Riesgo | Pros | Contras |
|---|---|---|---|---|---|---|---|
| A | Store operacional único con tablas/colecciones núcleo | Bajo | Baja | Rápido | Medio | Implementación ágil | Limitaciones en analítica y replay |
| B | Separación logical-first: operational + event + document | Medio | Media | Medio | Bajo-Medio | Equilibrio entre velocidad y crecimiento | Requiere diseño de contratos transversal |
| C | Persistencia poliglota completa desde inicio | Alto | Alta | Largo | Medio | Máxima flexibilidad por carga | Complejidad operativa temprana alta |

Recomendación: B.

## 3.4 Históricos Y Validación

| Opción | Descripción | Costo | Complejidad | Time-to-market | Riesgo | Pros | Contras |
|---|---|---|---|---|---|---|---|
| A | Snapshots periódicos sin event sourcing formal | Bajo | Baja | Rápido | Medio | Fácil de arrancar | Menor granularidad histórica |
| B | Snapshot + event log por predicción/informe/resultado | Medio | Media | Medio | Bajo-Medio | Buen balance para explainability y auditoría | Requiere disciplina de versionado |
| C | Event sourcing completo por agregado | Alto | Alta | Largo | Medio | Replay total y auditoría máxima | Coste cognitivo y técnico mayor |

Recomendación: B.

## 3.5 Event Bus

| Opción | Descripción | Costo | Complejidad | Time-to-market | Riesgo | Pros | Contras |
|---|---|---|---|---|---|---|---|
| A | Publicación interna simple de eventos (in-process abstraction) | Bajo | Baja | Rápido | Medio | Permite empezar sin gran infraestructura | Escala limitada multi-servicio |
| B | Bus desacoplado con particiones y DLQ conceptual | Medio | Media | Medio | Bajo-Medio | Escalable, resiliente, apto para replay parcial | Requiere operación y contratos maduros |
| C | Plataforma event streaming enterprise completa | Alto | Alta | Largo | Medio | Alta performance para cargas masivas | Costo alto y sobreingeniería inicial |

Recomendación: B, comenzando por A con contrato estable de eventos.

## 3.6 Cache Multicapa

| Opción | Descripción | Costo | Complejidad | Time-to-market | Riesgo | Pros | Contras |
|---|---|---|---|---|---|---|---|
| A | Solo L1 memoria (estado actual) | Bajo | Baja | Rápido | Medio-Alto | Muy simple | No escala horizontalmente |
| B | L1 memoria + L2 distribuida + invalidación por evento | Medio | Media | Medio | Bajo-Medio | Excelente relación costo/beneficio | Requiere diseño de llaves y TTL robusto |
| C | Cache avanzada con precomputación global y warming inteligente masivo | Alto | Alta | Largo | Medio | Muy buena latencia global | Alto costo de operación |

Recomendación: B.

## 3.7 API De Consumo

| Opción | Descripción | Costo | Complejidad | Time-to-market | Riesgo | Pros | Contras |
|---|---|---|---|---|---|---|---|
| A | API única interna sin versionado fuerte | Bajo | Baja | Rápido | Alto | Entrega rápida | Riesgo de breaking changes |
| B | API versionada por dominio (v1/v2) + quotas + contratos | Medio | Media | Medio | Bajo-Medio | Escalable para móvil/enterprise | Necesita governance y disciplina |
| C | API Gateway full enterprise + portal desarrolladores desde inicio | Alto | Alta | Largo | Medio | Excelente postura B2B | Coste alto prematuro |

Recomendación: B.

## 3.8 Observabilidad

| Opción | Descripción | Costo | Complejidad | Time-to-market | Riesgo | Pros | Contras |
|---|---|---|---|---|---|---|---|
| A | Logs básicos + métricas mínimas | Bajo | Baja | Rápido | Alto | Bajo esfuerzo | Pobre diagnóstico de incidentes complejos |
| B | Logs estructurados + métricas + trazas + alertas por SLO | Medio | Media | Medio | Bajo-Medio | Visibilidad completa end-to-end | Requiere tuning operativo |
| C | Observabilidad avanzada con analítica predictiva de incidentes | Alto | Alta | Largo | Medio | Excelente para gran escala | No prioritaria para fase actual |

Recomendación: B.

## 4. Decisiones Recomendadas (Baseline 12 Meses)

1. Ingesta: B (híbrida), iniciando por A endurecida.
2. Normalización: B.
3. Persistencia: B (separación operational + event + document).
4. Históricos/Validación: B.
5. Event Bus: B progresiva con contrato estable desde A.
6. Cache: B.
7. API: B.
8. Observabilidad: B.

Resultado esperado: plataforma equilibrada para escalar sin sobreingeniería temprana.

## 5. Matriz De Priorización (Impacto vs Esfuerzo)

### Alto impacto / Bajo-Medio esfuerzo (hacer primero)

- Contrato estándar de eventos
- Versionado explícito de API y contratos
- L2 cache distribuida + invalidación por evento
- Logs estructurados con correlationId
- Dashboard de proveedores y latencia

### Alto impacto / Alto esfuerzo (planificar por fases)

- Event bus desacoplado completo
- Read models especializados por producto
- Históricos con replay parcial
- Multi-tenant enterprise/white-label

### Medio impacto / Bajo esfuerzo

- Catálogo de entidades y ownership
- Convenciones de naming/keys/TTL
- Política de retención por tipo de dato

## 6. Escenarios De Adopción

## Escenario Fast (3 meses)

- A en ingesta
- B en normalización
- B en cache
- B en observabilidad
- API B mínima (versionado + contratos)

Beneficio: velocidad de entrega y reducción de riesgo inmediato.

## Escenario Balanceado (6-9 meses)

- B en casi todas las capas
- Event bus en rollout progresivo
- Históricos y validación listos para escalado

Beneficio: mejor punto óptimo para Sportiva24 actual.

## Escenario Enterprise (12+ meses)

- B consolidada + elementos C selectivos
- gobernanza avanzada, tenancy completo y portal API

Beneficio: máxima preparación B2B y white label.

## 7. Riesgos Por Decisión

- Riesgo de sobrediseño: elegir C temprano en múltiples capas.
- Riesgo de deuda: mantener A demasiado tiempo en eventos, cache o API.
- Riesgo de fragmentación: ausencia de contratos versionados y data ownership.
- Riesgo de operación: escalar sin observabilidad B.

## 8. Criterios De Gate Para Avanzar De A -> B -> C

1. Volumen de eventos por minuto supera umbral operativo.
2. Latencia p95/p99 incumple SLO por 2 sprints consecutivos.
3. Error rate de proveedor o fallback supera umbral acordado.
4. Nuevos deportes/competiciones superan capacidad de operación manual.
5. Requerimientos enterprise exigen version pinning, cuotas y aislamiento tenant.

## 9. Plan De Ejecución Recomendado

### Fase 1 (0-6 semanas)

- cerrar contrato de eventos
- definir naming y versionado
- reforzar métricas, logs y trazas
- introducir catálogo de entidades y ownership

### Fase 2 (6-12 semanas)

- habilitar bus desacoplado para eventos críticos
- activar L2 cache distribuida
- construir read models iniciales para centro/informes

### Fase 3 (12-20 semanas)

- consolidar históricos/validación con replay parcial
- endurecer API pública versionada con cuotas
- preparar baseline multi-tenant

### Fase 4 (20-32 semanas)

- optimización de costos
- capacidades enterprise/white-label avanzadas
- automatización de gobernanza y compliance de datos

## 10. Decisión Ejecutiva Recomendada

Adoptar estrategia Balanceada (B como baseline) con despliegue incremental y gates técnicos.

Razón:

- minimiza riesgo de sobreingeniería
- preserva time-to-market
- crea base sólida para millones de eventos y usuarios
- habilita evolución hacia enterprise sin reescrituras disruptivas
