"""Reproducible CPU benchmark for EN-05 using SQLite R*Tree.

The production endpoint uses the same R*Tree predicate. The benchmark creates an
isolated database, compares it with a full table scan, prints both query plans,
and fails unless CPU time improves by at least 15 percent.
"""
import json
import sqlite3
import tempfile
from pathlib import Path
from time import process_time


ROWS = 100_000
REPEATS = 400
BOUNDS = (-12.066, -12.064, -75.206, -75.203)


def elapsed(connection, sql, params):
    for _ in range(5):
        connection.execute(sql, params).fetchall()
    start = process_time()
    for _ in range(REPEATS):
        connection.execute(sql, params).fetchall()
    return process_time() - start


def main():
    with tempfile.TemporaryDirectory(prefix='ecologistica-spatial-') as folder:
        database = Path(folder) / 'benchmark.db'
        connection = sqlite3.connect(database)
        connection.executescript('''
            PRAGMA journal_mode=OFF;
            PRAGMA synchronous=OFF;
            CREATE TABLE pedidos(id INTEGER PRIMARY KEY, latitud REAL NOT NULL, longitud REAL NOT NULL);
            CREATE VIRTUAL TABLE pedidos_geo USING rtree(id, min_lat, max_lat, min_lng, max_lng);
        ''')
        rows = [(i, -12.30 + (i % 1000) * .0005, -75.50 + (i // 1000) * .005)
                for i in range(1, ROWS + 1)]
        connection.executemany('INSERT INTO pedidos VALUES (?,?,?)', rows)
        connection.executemany('INSERT INTO pedidos_geo VALUES (?,?,?,?,?)',
                               [(i, lat, lat, lng, lng) for i, lat, lng in rows])
        connection.commit()
        params = dict(south=BOUNDS[0], north=BOUNDS[1], west=BOUNDS[2], east=BOUNDS[3])
        scan = ('SELECT id FROM pedidos WHERE latitud BETWEEN :south AND :north '
                'AND longitud BETWEEN :west AND :east')
        indexed = ('SELECT p.id FROM pedidos_geo g JOIN pedidos p ON p.rowid=g.id '
                   'WHERE g.min_lat<=:north AND g.max_lat>=:south '
                   'AND g.min_lng<=:east AND g.max_lng>=:west')
        scan_seconds = elapsed(connection, scan, params)
        indexed_seconds = elapsed(connection, indexed, params)
        reduction = 100 * (scan_seconds - indexed_seconds) / scan_seconds
        result = {
            'rows': ROWS,
            'repeats': REPEATS,
            'scan_cpu_seconds': round(scan_seconds, 5),
            'rtree_cpu_seconds': round(indexed_seconds, 5),
            'cpu_reduction_percent': round(reduction, 1),
            'threshold_met': reduction >= 15,
            'scan_plan': connection.execute('EXPLAIN QUERY PLAN ' + scan, params).fetchall(),
            'rtree_plan': connection.execute('EXPLAIN QUERY PLAN ' + indexed, params).fetchall(),
        }
        print(json.dumps(result, ensure_ascii=False), flush=True)
        connection.close()
        if not result['threshold_met']:
            raise SystemExit('EN-05 failed: CPU reduction is below 15%')


if __name__ == '__main__':
    main()
