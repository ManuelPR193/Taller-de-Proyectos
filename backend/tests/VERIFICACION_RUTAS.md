# Validaci?n local ? 23 de octubre de 2026

Se corrigieron autenticaci?n de escrituras, registro p?blico sin privilegios administrativos, usuario inactivo, datos num?ricos y GPS, PDF, respuestas 404, entregas idempotentes, capacidad y duplicados expr?s, fechas y disponibilidad de recursos. El optimizador utiliza matrices viales enteras y costos de emisiones. El benchmark compara todas las permutaciones sobre la misma matriz dirigida: 9.499 km frente a 9.50 km redondeados del solver.

Ejecutar desde backend: `venv/Scripts/python -m unittest discover -s tests -v`.
Dependencias de prueba: `venv/Scripts/python -m pip install -r requirements-dev.txt`.
Desde frontend: `npm test` y `npm run build`.
Con la aplicaci?n en http://127.0.0.1:8000: ejecutar `backend/tests/browser_audit.py` y `backend/tests/browser_road_check.py` usando el Python del entorno virtual. Las pruebas del navegador requieren los datos demo; la prueba del mapa requiere rutas generadas.

## Resultados finales

- Backend: 44/44 pruebas aprobadas; SHA-256 de la base local sin cambios durante la bater?a.
- Frontend: 3/3 pruebas aprobadas y build de producci?n correcto.
- Navegador: login, nueve pantallas, logout y recarga sin recuperar sesi?n ficticia.
- Dos rutas demo generadas (HTTP 200); mapa con geometr?as de 120 y 416 puntos, sin errores JavaScript.
- Aplicaci?n servida en http://127.0.0.1:8000.

## Incidente de aislamiento de pruebas

La primera ejecuci?n conjunta import? la configuraci?n antes de establecer DATABASE_URL temporal; la auditor?a reinicializ? la base local. Se corrigi? creando un engine SQLite temporal expl?cito y sobrescribiendo get_db. Se conservaron copias del estado posterior al incidente en backend/venv/audit-db-backup.db y audit-db-before-recovery.db; no contienen los registros previos perdidos. Se restauraron los datos de demostraci?n desde seed_data.py. No se dispone de un respaldo confirmado de registros anteriores.

La validaci?n final compara el SHA-256 de la base de la aplicaci?n antes y despu?s de las pruebas para comprobar que no cambia.

## L?mites

La bater?a valida los escenarios implementados, no certifica todos los requisitos de producci?n. El ahorro de combustible se informa en cero porque no existe una l?nea base medida. La inserci?n expr?s a?n usa proximidad geogr?fica y no vuelve a resolver todas las ventanas horarias. La compilaci?n advierte de un bundle de JavaScript mayor de 500 kB. Mapas y primera descarga de la red vial requieren servicios externos.
