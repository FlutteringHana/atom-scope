import { expect, it } from 'vitest';
import { parts, relationships, topics } from './knowledge';
it('keeps knowledge identifiers unique, navigable, and in the three course parts', () => {
  expect(new Set(topics.map((t) => t.id)).size).toBe(topics.length);
  expect(parts.map((p) => p.id)).toEqual([1, 2, 3]);
  for (const topic of topics) {
    expect(parts.some((p) => p.id === topic.part)).toBe(true);
    for (const id of topic.related) expect(topics.some((t) => t.id === id)).toBe(true);
  }
  for (const r of relationships) {
    expect(topics.some((t) => t.id === r.from)).toBe(true);
    expect(topics.some((t) => t.id === r.to)).toBe(true);
  }
  expect(topics.find((t) => t.id === 'franck-hertz')?.priority).toBe('支撑');
});
