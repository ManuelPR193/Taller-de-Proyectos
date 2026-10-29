"""Additive SQLite migration: synchronized R*Tree for viewport order queries."""
from sqlalchemy import text


def install_spatial_index(engine):
    if engine.dialect.name != 'sqlite':
        return
    with engine.begin() as connection:
        connection.exec_driver_sql('CREATE INDEX IF NOT EXISTS ix_rutas_fecha ON rutas(fecha)')
        connection.exec_driver_sql('CREATE INDEX IF NOT EXISTS ix_detalles_ruta ON ruta_detalle(ruta_id)')
        connection.exec_driver_sql('CREATE INDEX IF NOT EXISTS ix_pedidos_estado ON pedidos(estado)')
        connection.exec_driver_sql('CREATE VIRTUAL TABLE IF NOT EXISTS pedidos_geo USING rtree(id, min_lat, max_lat, min_lng, max_lng)')
        for event, body in [
            ('INSERT', 'INSERT INTO pedidos_geo VALUES (new.rowid,new.latitud,new.latitud,new.longitud,new.longitud);'),
            ('UPDATE', 'DELETE FROM pedidos_geo WHERE id=old.rowid; INSERT INTO pedidos_geo VALUES (new.rowid,new.latitud,new.latitud,new.longitud,new.longitud);'),
            ('DELETE', 'DELETE FROM pedidos_geo WHERE id=old.rowid;'),
        ]:
            connection.exec_driver_sql(f'CREATE TRIGGER IF NOT EXISTS pedidos_geo_{event.lower()} AFTER {event} ON pedidos BEGIN {body} END')
        # Reconcile the derived index on every startup/migration. This also repairs
        # databases copied while triggers were disabled or created by older builds.
        connection.exec_driver_sql('DELETE FROM pedidos_geo')
        connection.exec_driver_sql('INSERT INTO pedidos_geo SELECT rowid,latitud,latitud,longitud,longitud FROM pedidos')


VIEWPORT_SQL = '''SELECT p.pedido_id FROM pedidos_geo g JOIN pedidos p ON p.rowid=g.id
WHERE g.min_lat<=:north AND g.max_lat>=:south AND g.min_lng<=:east AND g.max_lng>=:west
AND p.latitud BETWEEN :south AND :north AND p.longitud BETWEEN :west AND :east'''
