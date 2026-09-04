# METODOLOGIA OFICIAL DEL S24 INDEX

## Filosofia
La metodologia oficial del S24 Index define reglas de negocio claras para garantizar una evaluacion tecnica consistente, trazable y escalable.

Esta metodologia:
- No cambia interfaz ni experiencia visual.
- No depende de un deporte especifico.
- No depende de un proveedor de datos especifico.
- No representa probabilidad de victoria.

## Escala oficial del S24 Index (0-100)

| Rango | Interpretacion oficial |
| --- | --- |
| 95-100 | Nivel de elite mundial |
| 90-94 | Excelente momento competitivo |
| 85-89 | Muy buen rendimiento |
| 80-84 | Buen rendimiento |
| 75-79 | Competitivo |
| 70-74 | Aceptable |
| 60-69 | Rendimiento irregular |
| 50-59 | Bajo rendimiento |
| 40-49 | Muy bajo rendimiento |
| 0-39 | Estado critico |

Referencia tecnica en codigo:
- Escala: `S24_INDEX_SCALE` en `lib/intelligence-s24/metodologiaOficial.ts`
- Clasificacion: `classifyS24Index(score)`

## Nivel de Confianza
El Nivel de Confianza mide la calidad, consistencia y confiabilidad de la evaluacion realizada.

No representa la probabilidad de ganar.

### Niveles oficiales
- Muy Alta
- Alta
- Media
- Baja
- Muy Baja

### Criterios que afectan la confianza
- Cobertura de datos disponible (`dataCoverage`).
- Cantidad de factores con fallback aplicado.
- Volatilidad detectada en los datos (`volatility`).
- Tamano de muestra utilizado (`sampleSize`).

### Ejemplos de interpretacion
- Muy Alta: alta cobertura, baja volatilidad, sin o casi sin fallback, muestra suficiente.
- Alta: buena cobertura, volatilidad controlada, fallback limitado.
- Media: cobertura aceptable, algunos faltantes, volatilidad moderada.
- Baja: faltantes frecuentes y/o volatilidad elevada.
- Muy Baja: cobertura baja, alta inestabilidad y uso intensivo de fallback.

Referencia tecnica en codigo:
- Clasificacion: `classifyConfidence(score)`

## Tendencia
La Tendencia clasifica la evolucion reciente del equipo.

### Niveles oficiales
- Muy Positiva
- Positiva
- Estable
- Negativa
- Muy Negativa

### Metodo de clasificacion
Entrada de tendencia en escala de senal (aprox. -100 a 100):
- >= 40: Muy Positiva
- >= 15 y < 40: Positiva
- > -15 y < 15: Estable
- > -40 y <= -15: Negativa
- <= -40: Muy Negativa

### Fuente de la senal
- Prioridad 1: `signals.trendSignal` si existe.
- Prioridad 2: senal sintetica desde factores base (forma reciente, ofensivo, defensivo).

Referencia tecnica en codigo:
- Clasificacion: `classifyTrend(signal)`

## Nivel de Riesgo
El Nivel de Riesgo mide incertidumbre de la evaluacion.

No mide calidad del equipo.

### Niveles oficiales
- Bajo
- Medio
- Alto

### Factores que incrementan riesgo
- Lesiones y ausencias.
- Rotaciones no estables.
- Fatiga.
- Cobertura de datos insuficiente.
- Cambios recientes de contexto.
- Variabilidad de rendimiento.

### Metodo de clasificacion
La puntuacion de riesgo se construye por combinacion de:
- Volatilidad observada.
- Impacto de fallback.
- Impacto inverso de la confianza.

Clasificacion final:
- >= 67: Alto
- >= 34 y < 67: Medio
- < 34: Bajo

Referencia tecnica en codigo:
- Clasificacion: `classifyRisk(score)`

## Desglose oficial del S24 Index
La salida debe ser transparente y factorizada.

Formato esperado por factor:
- Puntos obtenidos / puntos maximos del peso del factor

Ejemplo de lectura:
- Forma Reciente ............ 24 / 25
- Rendimiento Ofensivo ...... 13 / 15
- Rendimiento Defensivo ..... 12 / 15
- Calidad de Plantilla ...... 9 / 10
- Disponibilidad ............ 10 / 10
- Fatiga .................... 8 / 10
- Contexto .................. 9 / 10
- Historial ................. 4 / 5

La suma de puntos obtenidos define el S24 Index total.

## Principios oficiales del modelo
- Transparencia
- Objetividad
- Explicabilidad
- Consistencia
- Escalabilidad
- Neutralidad
- Reproducibilidad

## Metodologia de evaluacion
1. Normalizar factores a escala 0-100.
2. Aplicar pesos oficiales del modelo (suma = 100).
3. Calcular puntaje ponderado por factor.
4. Sumar puntajes para obtener S24 Index (0-100).
5. Calcular Nivel de Confianza de la evaluacion.
6. Calcular Tendencia.
7. Calcular Nivel de Riesgo (incertidumbre).
8. Publicar desglose completo por factor y diagnosticos.

## Definiciones oficiales
- S24 Index: puntaje tecnico agregado de rendimiento competitivo de un equipo o escenario.
- Nivel de Confianza: calidad y consistencia de la evaluacion.
- Tendencia: direccion reciente del rendimiento.
- Nivel de Riesgo: grado de incertidumbre en la evaluacion.

## Glosario oficial
- S24 Index: indice tecnico global de evaluacion de 0 a 100.
- Motor de Inteligencia S24: motor interno que agrega factores y genera salida explicable.
- Nivel de Confianza: indicador de robustez de datos y estabilidad del calculo.
- Tendencia: clasificacion de la evolucion reciente del rendimiento.
- Nivel de Riesgo: indicador de incertidumbre operativa y de datos.
- Forma Reciente: comportamiento competitivo en el corto plazo.
- Contexto: condiciones del partido (localia, relevancia, entorno competitivo).
- Disponibilidad: estado de disponibilidad del plantel utilizable.
- Fatiga: carga fisica y de calendario que puede degradar desempeno.
- Rendimiento Ofensivo: eficacia para generar y convertir opciones de anotacion.
- Rendimiento Defensivo: capacidad para contener al rival y reducir dano recibido.

## Ejemplos rapidos de interpretacion
- Caso A: S24 Index 92, Confianza Alta, Tendencia Positiva, Riesgo Bajo.
Interpretacion: alto nivel competitivo con evaluacion robusta y baja incertidumbre.

- Caso B: S24 Index 78, Confianza Media, Tendencia Estable, Riesgo Medio.
Interpretacion: equipo competitivo, pero con senales mixtas y margen de variabilidad.

- Caso C: S24 Index 58, Confianza Baja, Tendencia Negativa, Riesgo Alto.
Interpretacion: rendimiento bajo e incierto; resultado sensible a nueva informacion.

## Plantilla oficial de lectura por partido
Formato recomendado para consumo interno y futuras visualizaciones:

1. Encabezado del partido.
2. Bloque S24 Index (ambos equipos + ventaja competitiva).
3. Veredicto S24 (texto corto explicable).
4. Nivel de confianza (nivel + score en porcentaje).
5. Nivel de riesgo.
6. Tendencia por equipo.
7. Desglose por factor (puntos obtenidos/maximos).
8. Ventajas principales.
9. Riesgos principales.
10. Conclusion.

### Ejemplo oficial (referencia)
Real Madrid vs Barcelona
Domingo 18:00

S24 Index:
- Real Madrid: 91
- Barcelona: 84
- Ventaja competitiva: Real Madrid

Veredicto S24:
- Real Madrid llega con ventaja gracias a su mejor forma reciente y menor fatiga.

Nivel de confianza:
- Muy Alta
- 94%

Nivel de riesgo:
- Bajo

Tendencia:
- Real Madrid: Muy Positiva
- Barcelona: Estable

Desglose:
- Forma: 24/25
- Ataque: 13/15
- Defensa: 12/15
- Plantilla: 9/10
- Disponibilidad: 10/10
- Fatiga: 8/10
- Contexto: 9/10
- Historial: 4/5

Ventajas:
- Mejor forma
- Menor fatiga
- Mayor estabilidad

Riesgos:
- Barcelona recupera jugadores.
- Partido de alta presion.

Conclusion:
- Escenario favorable para Real Madrid, con ventaja competitiva clara y riesgo controlado.

## Estandar interno de salida
La salida para resumen de partido se puede estructurar internamente con:
- `buildS24MatchInterpretation(input)` en `lib/intelligence-s24/interpretacionPartido.ts`

Este estandar no modifica interfaz actual y deja el resultado listo para uso posterior en capas de presentacion.
