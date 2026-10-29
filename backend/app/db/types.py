"""Application-level encryption for sensitive database fields."""
import base64
import hashlib
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from sqlalchemy import Text
from sqlalchemy.types import TypeDecorator
from app.core.config import settings


class EncryptedString(TypeDecorator):
    """AES-256-GCM value with backward-compatible plaintext reads."""
    impl = Text
    cache_ok = True
    prefix = 'enc:v1:'

    @staticmethod
    def cipher():
        key = hashlib.sha256(settings.DATA_ENCRYPTION_KEY.encode('utf-8')).digest()
        return AESGCM(key)

    def process_bind_param(self, value, dialect):
        if value is None or str(value).startswith(self.prefix):
            return value
        nonce = os.urandom(12)
        encrypted = self.cipher().encrypt(nonce, str(value).encode('utf-8'), None)
        return self.prefix + base64.urlsafe_b64encode(nonce + encrypted).decode('ascii')

    def process_result_value(self, value, dialect):
        if value is None or not str(value).startswith(self.prefix):
            return value
        raw = base64.urlsafe_b64decode(value[len(self.prefix):])
        return self.cipher().decrypt(raw[:12], raw[12:], None).decode('utf-8')
