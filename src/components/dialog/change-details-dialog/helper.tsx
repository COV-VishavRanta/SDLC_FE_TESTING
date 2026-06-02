/* eslint-disable camelcase */
import { Label } from '@/components';

const MASKED_CHANGE_KEY_MESSAGES: Record<string, string> = {
  schema_json: 'One or more survey questions were updated.',
  survey_response: 'A survey response was submitted.',
};

const JSON_PARSE_ERROR = Symbol('JSON_PARSE_ERROR');

function getMaskedChangeMessageForKey(key: string): string | undefined {
  return MASKED_CHANGE_KEY_MESSAGES[key.trim().toLowerCase()];
}

function findClosingQuoteIndex(value: string, start: number, quote: string): number {
  for (let index = start + 1; index < value.length; index += 1) {
    if (value[index] === '\\') {
      index += 1;
      continue;
    }

    if (value[index] === quote) {
      return index;
    }
  }

  return -1;
}

function skipWhitespace(value: string, start: number): number {
  let cursor = start;

  while (cursor < value.length && /\s/.test(value[cursor])) {
    cursor += 1;
  }

  return cursor;
}

// Replaces only masked key values in raw payloads so nested quoted JSON does not break parsing.
function maskKnownNestedJsonValueStrings(rawValue: string): string {
  const replacements: { start: number; end: number; replacement: string }[] = [];
  let cursor = 0;

  while (cursor < rawValue.length) {
    const current = rawValue[cursor];

    if (current !== "'" && current !== '"') {
      cursor += 1;
      continue;
    }

    const keyEnd = findClosingQuoteIndex(rawValue, cursor, current);
    if (keyEnd === -1) {
      break;
    }

    const key = rawValue.slice(cursor + 1, keyEnd);
    let valueStart = skipWhitespace(rawValue, keyEnd + 1);

    if (rawValue[valueStart] !== ':') {
      cursor = keyEnd + 1;
      continue;
    }

    const maskedMessage = getMaskedChangeMessageForKey(key);
    if (!maskedMessage) {
      cursor = keyEnd + 1;
      continue;
    }

    valueStart = skipWhitespace(rawValue, valueStart + 1);
    const valueQuote = rawValue[valueStart];

    if (valueQuote !== "'" && valueQuote !== '"') {
      cursor = valueStart + 1;
      continue;
    }

    const valueEnd = findClosingQuoteIndex(rawValue, valueStart, valueQuote);
    if (valueEnd === -1) {
      break;
    }

    const escapedMessage = maskedMessage
      .replace(/\\/g, '\\\\')
      .replaceAll(valueQuote, `\\${valueQuote}`);

    replacements.push({
      start: valueStart,
      end: valueEnd + 1,
      replacement: `${valueQuote}${escapedMessage}${valueQuote}`,
    });

    cursor = valueEnd + 1;
  }

  if (replacements.length === 0) {
    return rawValue;
  }

  let result = '';
  let lastIndex = 0;

  for (const replacement of replacements) {
    result += rawValue.slice(lastIndex, replacement.start);
    result += replacement.replacement;
    lastIndex = replacement.end;
  }

  result += rawValue.slice(lastIndex);
  return result;
}

function transformSpecialChangeKeys(value: unknown, colorClass: 'previous' | 'updated'): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => transformSpecialChangeKeys(item, colorClass));
  }

  if (value === null || typeof value !== 'object') {
    return value;
  }

  const result: Record<string, unknown> = {};

  for (const [key, currentValue] of Object.entries(value as Record<string, unknown>)) {
    const maskedMessage = getMaskedChangeMessageForKey(key);

    if (maskedMessage) {
      if (colorClass === 'updated') {
        result[key] = maskedMessage;
      }
      continue;
    }

    result[key] = transformSpecialChangeKeys(currentValue, colorClass);
  }

  return result;
}

function parseJson(value: string): unknown | typeof JSON_PARSE_ERROR {
  try {
    return JSON.parse(value);
  } catch {
    return JSON_PARSE_ERROR;
  }
}

/**
 * Converts Python repr() strings to valid JSON.
 * Handles: single quotes → double quotes, True/False/None → true/false/null
 */
function pythonReprToJson(str: string): string {
  return str
    .replace(/'/g, '"')
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')
    .replace(/\bNone\b/g, 'null');
}

/** Try to parse a JSON string. Handles both standard JSON and Python repr() output. */
function tryParseJson(
  value: string | null | undefined,
  colorClass: 'previous' | 'updated',
): unknown {
  if (!value) return null;

  const maskedRawValue = maskKnownNestedJsonValueStrings(value);
  const parseCandidates = [
    value,
    pythonReprToJson(value),
    maskedRawValue,
    pythonReprToJson(maskedRawValue),
  ];

  for (const candidate of parseCandidates) {
    const parsed = parseJson(candidate);

    if (parsed !== JSON_PARSE_ERROR) {
      return transformSpecialChangeKeys(parsed, colorClass);
    }
  }

  return value;
}

/** Formats a primitive value for display */
function formatPrimitive(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.map(formatPrimitive).join(', ');
  return String(value);
}

/** Renders a parsed JSON value — either a key-value table or plain text */
function JsonValueDisplay({ value }: { value: unknown }) {
  if (value === null || value === undefined) {
    return <span className='text-text-secondary text-sm'>—</span>;
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return <span className='text-text-secondary text-sm'>—</span>;
    return (
      <table className='w-full text-sm border-collapse'>
        <tbody>
          {entries.map(([key, val]) => (
            <tr key={key} className='border-b border-border last:border-0'>
              {/* th scope="row" semantically marks the key as a row header (WCAG 1.3.1) */}
              <th
                scope='row'
                className='py-1.5 pr-4 font-medium text-text-heading w-1/3 capitalize text-left'
              >
                {/* Convert camelCase or snake_case to human-readable format */}
                {key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ')}
              </th>
              <td className='py-1.5 text-text-secondary break-all'>{formatPrimitive(val)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (Array.isArray(value)) {
    return <span className='text-text-secondary text-sm'>{formatPrimitive(value)}</span>;
  }

  return <span className='text-sm text-text-secondary'>{formatPrimitive(value)}</span>;
}

/** A boxed container that renders either JSON key-value view or plain text */
export function ChangeValueBox({
  label,
  rawValue,
  colorClass,
  arrowRenderer,
}: {
  label: string;
  rawValue?: string | null;
  colorClass: 'previous' | 'updated';
  arrowRenderer?: React.ReactNode;
}) {
  const parsed = tryParseJson(rawValue, colorClass);
  const isStructured = parsed !== null && typeof parsed === 'object';

  const styles = {
    previous: {
      bg: 'bg-change-previous-bg',
      border: 'border-change-previous-border',
      text: 'text-[var(--badge-error-text)]',
    },
    updated: {
      bg: 'bg-change-updated-bg',
      border: 'border-change-updated-border',
      text: 'text-[var(--badge-success-text)]',
    },
  }[colorClass];

  if (parsed === null) {
    return null;
  }

  return (
    <>
      <div className='space-y-2'>
        <Label className='text-[16px] font-medium leading-[20px] tracking-[-0.15px] text-text-heading'>
          {label}
        </Label>
        <div
          className={`${styles.bg} border-2 ${styles.border} flex items-center rounded-lg p-[14px]`}
        >
          {isStructured ? (
            <JsonValueDisplay value={parsed} />
          ) : (
            <p
              className={`text-sm font-medium leading-[20px] tracking-[-0.15px] ${styles.text} break-all`}
            >
              {formatPrimitive(parsed)}
            </p>
          )}
        </div>
      </div>
      {/* Arrow Renderer */}
      {arrowRenderer && <div className='mt-2'>{arrowRenderer}</div>}
    </>
  );
}
