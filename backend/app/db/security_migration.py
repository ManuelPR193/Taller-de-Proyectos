"""Idempotent migration of legacy plaintext sensitive values."""
from app.db.types import EncryptedString


def encrypt_legacy_driver_dni(engine):
    encrypted_type = EncryptedString()
    with engine.begin() as connection:
        inspector = connection.exec_driver_sql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='conductores'"
        ).first() if engine.dialect.name == 'sqlite' else True
        if not inspector:
            return 0
        rows = connection.exec_driver_sql('SELECT conductor_id, dni FROM conductores').all()
        migrated = 0
        for conductor_id, dni in rows:
            if dni and not str(dni).startswith(encrypted_type.prefix):
                encrypted = encrypted_type.process_bind_param(dni, engine.dialect)
                connection.exec_driver_sql(
                    'UPDATE conductores SET dni=:dni WHERE conductor_id=:id',
                    {'dni': encrypted, 'id': conductor_id})
                migrated += 1
        return migrated
