from sqlalchemy import inspect


def add_delivery_gps_columns(engine):
    """Add confirmation coordinates to databases created before this release."""
    columns = {column["name"] for column in inspect(engine).get_columns("ruta_detalle")}
    with engine.begin() as connection:
        if "latitud_entrega" not in columns:
            connection.exec_driver_sql("ALTER TABLE ruta_detalle ADD COLUMN latitud_entrega FLOAT")
        if "longitud_entrega" not in columns:
            connection.exec_driver_sql("ALTER TABLE ruta_detalle ADD COLUMN longitud_entrega FLOAT")
