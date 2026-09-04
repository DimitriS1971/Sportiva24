# MOTOR DE INTELIGENCIA S24

## Estado oficial
Este documento describe la arquitectura del motor.

La metodologia oficial de negocio del S24 Index se define en:
- `docs/METODOLOGIA_S24_INDEX.md`

## Filosofia
El Motor de Inteligencia S24 es el nucleo de evaluacion tecnica de Sportiva24.

- No depende de un deporte especifico.
- No depende de un proveedor especifico.
- No expone internamente detalles al frontend fuera del resultado final.
- Su salida de producto es el S24 Index con explicabilidad completa.

## Objetivo de arquitectura
Construir una base modular, escalable y transparente para calcular S24 Index en cualquier contexto deportivo, preparando evolucion futura sin reescribir el motor.

## Estructura
- `lib/intelligence-s24/types.ts`: contratos del motor.
- `lib/intelligence-s24/config.ts`: pesos y configuracion central.
- `lib/intelligence-s24/factors/`: modulos independientes por factor.
- `lib/intelligence-s24/motorDeInteligenciaS24.ts`: combinador central sin logica de deporte.
- `lib/intelligence-s24/index.ts`: exportaciones publicas.

## Modulos de factores
Cada modulo devuelve puntuacion normalizada de 0 a 100.

- Forma Reciente
- Rendimiento Ofensivo
- Rendimiento Defensivo
- Calidad de Plantilla
- Disponibilidad del Plantel
- Fatiga
- Contexto del Partido
- Historial entre Equipos

Cada factor puede evolucionar de manera independiente sin afectar el resto del sistema.

## Pesos iniciales
Configurados en `S24_DEFAULT_WEIGHTS`.

- Forma Reciente: 25%
- Rendimiento Ofensivo: 15%
- Rendimiento Defensivo: 15%
- Calidad de Plantilla: 10%
- Disponibilidad: 10%
- Fatiga: 10%
- Contexto: 10%
- Historial: 5%

Los pesos se validan para sumar 100 y pueden modificarse sin tocar el motor.

## Flujo completo
1. Se recibe `S24InputContext` con factores y señales.
2. El motor ejecuta todos los modulos de factor.
3. Cada modulo devuelve `rawScore` (0-100) y bandera de fallback.
4. El motor aplica pesos configurados y calcula puntos por factor.
5. Se calcula `s24Index` total (0-100).
6. Se calcula `confidence` (Muy Alta/Alta/Media/Baja/Muy Baja).
7. Se calcula `trend` (Muy Positiva/Positiva/Estable/Negativa/Muy Negativa).
8. Se calcula `risk` (Bajo/Medio/Alto).
9. Se devuelve desglose transparente por factor.

## Resultado del motor
El motor retorna:

- `s24Index`
- `confidence`
- `trend`
- `risk`
- `factorBreakdown`
- `diagnostics`

El desglose incluye puntos obtenidos y maximos por factor para trazabilidad.

## Contrato unificado IntelligenceProfile

Consolidacion Fase 1:

- El motor incorpora salida unificada `MatchIntelligenceProfile` mediante `calculateMatchProfile(...)`.
- El motor mantiene `calculate(...)` para compatibilidad backward.
- Los analisis de producto convergen hacia `IntelligenceProfile` como contrato oficial.

Bloques comunes que entrega el perfil:

- Identity
- CompetitiveState
- Indicators
- Factors
- Narrative
- Insights
- Alerts
- History
- Evidence
- Validation
- AnalyticalPassport
- Metadata
- Version

## Metodologia centralizada
El motor consume clasificadores oficiales compartidos desde:
- `lib/intelligence-s24/metodologiaOficial.ts`

Incluye:
- Escala oficial de interpretacion S24 Index.
- Clasificacion oficial de confianza.
- Clasificacion oficial de tendencia.
- Clasificacion oficial de riesgo.

## Ejemplo de uso interno (sin UI)
El siguiente ejemplo muestra como calcular salida S24 para dos equipos y construir un resumen tecnico de partido reutilizable.

```ts
import {
	buildS24MatchInterpretation,
	motorDeInteligenciaS24,
	type S24InputContext,
} from '@/lib/intelligence-s24';

const realMadridInput: S24InputContext = {
	sport: 'football',
	teamId: 'rm',
	teamName: 'Real Madrid',
	factors: {
		recentForm: 96,
		offensivePerformance: 88,
		defensivePerformance: 80,
		squadQuality: 90,
		squadAvailability: 100,
		fatigue: 80,
		matchContext: 90,
		headToHead: 80,
	},
	signals: {
		trendSignal: 42,
		dataCoverage: 96,
		volatility: 14,
	},
	metadata: {
		sampleSize: 10,
	},
};

const barcelonaInput: S24InputContext = {
	sport: 'football',
	teamId: 'fcb',
	teamName: 'Barcelona',
	factors: {
		recentForm: 84,
		offensivePerformance: 83,
		defensivePerformance: 78,
		squadQuality: 86,
		squadAvailability: 82,
		fatigue: 76,
		matchContext: 82,
		headToHead: 72,
	},
	signals: {
		trendSignal: 2,
		dataCoverage: 93,
		volatility: 22,
	},
	metadata: {
		sampleSize: 10,
	},
};

const realMadridOutput = motorDeInteligenciaS24.calculate(realMadridInput);
const barcelonaOutput = motorDeInteligenciaS24.calculate(barcelonaInput);

const resumen = buildS24MatchInterpretation({
	matchLabel: 'Real Madrid vs Barcelona',
	kickoffLabel: 'Domingo 18:00',
	local: {
		teamName: 'Real Madrid',
		output: realMadridOutput,
	},
	visitante: {
		teamName: 'Barcelona',
		output: barcelonaOutput,
	},
	riskNotes: ['Barcelona recupera jugadores.', 'Partido de alta presion.'],
	conclusion: 'Escenario favorable para Real Madrid, con ventaja competitiva clara y riesgo controlado.',
});

// `resumen` contiene:
// - S24 Index por equipo
// - ventaja competitiva
// - veredicto
// - confianza + riesgo
// - tendencia por equipo
// - desglose por factor
// - ventajas, riesgos y conclusion
```

## Transparencia
El modelo permite explicar el resultado final de forma directa con salida del tipo:

- Forma Reciente: X / 25
- Rendimiento Ofensivo: X / 15
- Rendimiento Defensivo: X / 15
- Calidad de Plantilla: X / 10
- Disponibilidad: X / 10
- Fatiga: X / 10
- Contexto: X / 10
- Historial: X / 5

## Futuras mejoras (no implementadas en este sprint)
- Integrar modelos de Machine Learning para cada factor.
- Ajuste automatico de pesos por deporte/competicion.
- Sistemas predictivos avanzados y redes neuronales.
- Aprendizaje continuo sobre retroalimentacion historica.
- Versionado de modelos y comparacion A/B.

La arquitectura actual ya esta preparada para incorporar esas mejoras sin romper interfaces existentes.
