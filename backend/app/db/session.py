import logging
from time import perf_counter
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)

slow_query_log = logging.getLogger('ecologistica.slow_query')


@event.listens_for(engine, 'before_cursor_execute')
def before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    context._ecologistica_started_at = perf_counter()


@event.listens_for(engine, 'after_cursor_execute')
def after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    elapsed_ms = (perf_counter() - context._ecologistica_started_at) * 1000
    if elapsed_ms >= settings.SLOW_QUERY_MS:
        slow_query_log.warning('slow_query duration_ms=%.1f statement=%s', elapsed_ms, statement[:500])

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
