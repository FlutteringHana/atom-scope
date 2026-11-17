import { useMemo, type MouseEvent } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import type { QuantityId } from '../../physics/rutherford/types';
import { quantityNames } from '../../content/rutherfordQuantities';

export function formulaTex(tex: string) {
  return tex.replace(
    /\[\[([a-z-]+):([\s\S]*?)\]\]/g,
    (_, id: string, value: string) => `\\htmlClass{rf-token rf-q-${id}}{${value}}`,
  );
}
export function MathFormula({
  tex,
  selected,
  onSelect,
  label,
}: {
  tex: string;
  selected?: QuantityId;
  onSelect?: (id: QuantityId) => void;
  label?: string;
}) {
  const html = useMemo(
    () =>
      katex.renderToString(formulaTex(tex), {
        displayMode: true,
        output: 'htmlAndMathml',
        throwOnError: true,
        strict: 'ignore',
        trust: (context) => context.command === '\\htmlClass',
      }),
    [tex],
  );
  const tokenIds = [
    ...new Set(Array.from(tex.matchAll(/\[\[([a-z-]+):/g), (m) => m[1] as QuantityId)),
  ];
  const activate = (event: MouseEvent<HTMLDivElement>) => {
    const token = (event.target as Element).closest('.rf-token');
    const key = Array.from(token?.classList || [])
      .find((c) => c.startsWith('rf-q-'))
      ?.slice(5) as QuantityId | undefined;
    if (key && onSelect) {
      event.preventDefault();
      onSelect(key);
    }
  };
  return (
    <div className={`rf-math-block rf-select-${selected || 'none'}`}>
      <div
        className="rf-equation"
        aria-label={label}
        onClick={activate}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {onSelect && tokenIds.length > 0 && (
        <div className="rf-symbol-controls" aria-label="公式符号检查">
          <span>检查符号</span>
          {tokenIds.map((id) => (
            <button
              key={id}
              aria-label={`检查 ${quantityNames[id][0]} · ${quantityNames[id][1]}`}
              aria-pressed={selected === id}
              className={`rf-q-${id}`}
              onClick={() => onSelect(id)}
            >
              {quantityNames[id][0]}
              {selected === id ? ' ✓' : ''}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
