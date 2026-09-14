# Protocolo de revision de analisis

Antes de publicar un analisis de partido, el sistema debe comprobar automaticamente:

1. Identidad: local, visitante y competicion deben coincidir con el fixture solicitado.
2. Favorito: el mismo equipo debe aparecer en titulo, senal principal, diferencial y conclusion.
3. Probabilidades: local + empate + visitante debe sumar 100; la probabilidad mayor debe corresponder al favorito.
4. Historial: nunca usar frases como "respalda al local" sin comparar victorias local, empates y victorias visitante.
5. Tabla: posicion y puntos deben pertenecer al equipo mostrado, sin valores por defecto presentados como hechos.
6. Forma: los ultimos partidos deben corresponder al equipo correcto y excluir el partido actual.
7. Contenido editorial: no puede contener nombres de otro partido ni datos fijos de un fixture anterior.
8. Datos insuficientes: mostrar "no informado" o una lectura prudente, nunca inventar cifras.

La revision automatica debe ejecutarse al construir cada informe. Si encuentra una contradiccion critica, debe registrar el problema y sustituir el texto por una formulacion neutral antes de renderizar.
