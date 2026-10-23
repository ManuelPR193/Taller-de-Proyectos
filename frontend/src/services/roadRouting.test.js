import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getRoadRoute, routePoints } from './roadRouting.js';

test('orders stops without mutating them and includes the return to depot', () => {
  const detalles = [
    { orden_visita: 2, latitud: -12.09, longitud: -75.21 },
    { orden_visita: 1, latitud: -12.04, longitud: -75.23 },
  ];
  assert.deepEqual(routePoints({ detalles }, { lat: -12.0656, lng: -75.2048 }), [
    [-12.0656, -75.2048], [-12.04, -75.23], [-12.09, -75.21], [-12.0656, -75.2048],
  ]);
  assert.equal(detalles[0].orden_visita, 2);
});

test('requests road geometry, converts axes and caches successful routes', async t => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async url => {
    calls++;
    assert.ok(url.startsWith('/api/v1/roads/path?coordinates='));
    assert.equal(new URL(url, 'http://localhost').searchParams.get('coordinates'), '-75.2,-12.06;-75.21,-12.07');
    return { ok: true, json: async () => ({ code: 'Ok', routes: [{ geometry: {
      type: 'LineString', coordinates: [[-75.2, -12.06], [-75.205, -12.065], [-75.21, -12.07]],
    } }] }) };
  });
  const points = [[-12.06, -75.2], [-12.07, -75.21]];
  assert.deepEqual(await getRoadRoute(points), [[-12.06, -75.2], [-12.065, -75.205], [-12.07, -75.21]]);
  await getRoadRoute(points);
  assert.equal(calls, 1);
});

test('does not invent straight geometry when no road exists; failures can be retried', async t => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    calls++;
    return { ok: true, json: async () => ({ code: 'NoRoute' }) };
  });
  const points = [[-12, -75], [-13, -76]];
  await assert.rejects(getRoadRoute(points), /recorrido/);
  await assert.rejects(getRoadRoute(points), /recorrido/);
  assert.equal(calls, 2);
  await assert.rejects(getRoadRoute([[999, 999], [0, 0]]), /inválidas/);
  assert.equal(calls, 2);
});
