const ESC = String.fromCharCode(27);
const BEL = String.fromCharCode(7);
const CSI_RE = new RegExp(`${ESC}\\[[0-9;?]*[ -/]*[@-~]`, 'g');
const OSC_RE = new RegExp(`${ESC}\\][^${BEL}\\r\\n]*(?:${BEL}|${ESC}\\\\)`, 'g');

export type UiBadgeStatus = 'passed' | 'pass' | 'failed' | 'fail' | 'skipped' | 'skip' | 'dry-run' | 'yes' | 'no';

export type UiHeaderMetaRow = {
  label: string;
  value: string;
};

export type UiTableAlign = 'left' | 'right';

export type UiStream = {
  write: (chunk: string) => unknown;
  isTTY?: boolean;
};

export type UiStyler = {
  bold: (text: string) => string;
  dim: (text: string) => string;
  cyan: (text: string) => string;
  green: (text: string) => string;
  red: (text: string) => string;
  yellow: (text: string) => string;
  gray: (text: string) => string;
};

export type SpinnerHandle = {
  start: (text: string) => void;
  update: (text: string) => void;
  succeed: (text: string) => void;
  fail: (text: string) => void;
  skip: (text: string) => void;
  info: (text: string) => void;
  stop: () => void;
};

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'] as const;

/**
 * Remove ANSI escape sequences so column width measurements remain accurate.
 */
export function stripAnsi(text: string): string {
  return text.replace(OSC_RE, '').replace(CSI_RE, '');
}

/**
 * Determine whether ANSI colors should be emitted for a target stream.
 */
export function supportsColor(stream: { isTTY?: boolean } = process.stdout): boolean {
  const noColor = process.env.NO_COLOR;
  if (noColor !== undefined && noColor.trim() !== '') {
    return false;
  }

  const forceColor = process.env.FORCE_COLOR?.trim().toLowerCase();
  if (forceColor === '1' || forceColor === 'true') {
    return true;
  }
  if (forceColor === '0' || forceColor === 'false') {
    return false;
  }

  return Boolean(stream.isTTY && process.env.TERM !== 'dumb');
}

/**
 * Determine whether single-line ANSI cursor rewrites (`\r`) are appropriate.
 */
export function isInteractiveTty(stream: { isTTY?: boolean } = process.stderr): boolean {
  const ci = process.env.CI?.trim().toLowerCase();
  if (ci === '1' || ci === 'true') {
    return false;
  }
  return Boolean(stream.isTTY && process.env.TERM !== 'dumb');
}

function wrapSgr(text: string, openCode: number, closeCode: number, enabled: boolean): string {
  if (!enabled || text.length === 0) {
    return text;
  }
  return `${ESC}[${openCode}m${text}${ESC}[${closeCode}m`;
}

/**
 * Build minimal zero-dependency ANSI styling helpers.
 */
export function createStyler(colorEnabled: boolean): UiStyler {
  return {
    bold: text => wrapSgr(text, 1, 22, colorEnabled),
    dim: text => wrapSgr(text, 2, 22, colorEnabled),
    red: text => wrapSgr(text, 31, 39, colorEnabled),
    green: text => wrapSgr(text, 32, 39, colorEnabled),
    yellow: text => wrapSgr(text, 33, 39, colorEnabled),
    cyan: text => wrapSgr(text, 36, 39, colorEnabled),
    gray: text => wrapSgr(text, 90, 39, colorEnabled),
  };
}

/**
 * Format elapsed seconds cleanly for terminal tables and live status lines.
 */
export function formatDuration(seconds: number): string {
  const safe = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  if (safe < 60) {
    return `${safe.toFixed(1)}s`;
  }
  const rounded = Math.round(safe);
  if (rounded < 3600) {
    const minutes = Math.floor(rounded / 60);
    const remSeconds = rounded % 60;
    return `${minutes}m ${String(remSeconds).padStart(2, '0')}s`;
  }
  const hours = Math.floor(rounded / 3600);
  const remMinutes = Math.floor((rounded % 3600) / 60);
  return `${hours}h ${String(remMinutes).padStart(2, '0')}m`;
}

/**
 * Truncate text to at most `maxWidth` visible characters, appending `…` when clipped.
 */
export function truncateText(text: string, maxWidth: number): string {
  if (maxWidth <= 1 || text.length <= maxWidth) {
    return text;
  }
  return `${text.slice(0, maxWidth - 1)}…`;
}

/**
 * Render a concise, color-coded status badge.
 */
export function statusBadge(status: UiBadgeStatus, colorEnabled: boolean): string {
  const s = createStyler(colorEnabled);
  switch (status) {
    case 'passed':
    case 'pass':
      return s.green('✔ PASS');
    case 'failed':
    case 'fail':
      return s.red('✖ FAIL');
    case 'skipped':
    case 'skip':
      return s.yellow('○ SKIP');
    case 'dry-run':
      return s.cyan('◇ DRY-RUN');
    case 'yes':
      return s.green('✔ YES');
    case 'no':
      return s.dim('✖ NO');
  }
}

function padVisible(text: string, width: number, align: UiTableAlign = 'left'): string {
  const visibleLen = stripAnsi(text).length;
  const padCount = Math.max(0, width - visibleLen);
  return align === 'right' ? `${' '.repeat(padCount)}${text}` : `${text}${' '.repeat(padCount)}`;
}

/**
 * Render a rounded Unicode (or ASCII fallback) summary banner with aligned metadata rows.
 */
export function renderHeaderBox(
  title: string,
  meta: readonly UiHeaderMetaRow[],
  options?: { color?: boolean; ascii?: boolean; maxWidth?: number; minWidth?: number }
): string {
  const color = options?.color ?? false;
  const ascii = options?.ascii ?? process.env.TERM === 'dumb';
  const s = createStyler(color);
  const minWidth = options?.minWidth ?? 60;
  const maxWidth = options?.maxWidth ?? 96;

  const corners = ascii
    ? { tl: '+', tr: '+', bl: '+', br: '+', h: '-', v: '|' }
    : { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│' };

  const cleanMeta = meta.filter(row => row.value.trim().length > 0);
  const labelWidth = cleanMeta.reduce((max, row) => Math.max(max, row.label.length), 0);

  const rawRows = cleanMeta.map(row => {
    const labelText = row.label.padEnd(labelWidth);
    const availableValWidth = Math.max(20, maxWidth - 4 - labelWidth - 2);
    const collapsed = row.value.replace(/\s+/g, ' ').trim();
    const plain = stripAnsi(collapsed);
    const valText = plain.length > availableValWidth ? truncateText(plain, availableValWidth) : collapsed;
    const valVisibleLen = Math.min(plain.length, availableValWidth);
    return {
      visibleLen: labelWidth + 2 + valVisibleLen,
      rendered: `${s.dim(labelText)}  ${valText}`,
    };
  });

  const cleanTitle = title.replace(/\s+/g, ' ').trim();
  const plainTitle = stripAnsi(cleanTitle);
  const titleText = plainTitle.length > maxWidth - 8 ? truncateText(plainTitle, maxWidth - 8) : cleanTitle;
  const titleHeaderVisible = ` ${stripAnsi(titleText)} `;
  const titleHeaderStyled = ` ${titleText} `;
  const widestContent = Math.max(minWidth - 4, titleHeaderVisible.length + 2, ...rawRows.map(r => r.visibleLen));
  const innerWidth = Math.min(maxWidth - 2, widestContent + 2);

  const topDashCount = Math.max(1, innerWidth - titleHeaderVisible.length - 1);
  const topBorder = `${s.dim(`${corners.tl}${corners.h}`)}${s.bold(titleHeaderStyled)}${s.dim(`${corners.h.repeat(topDashCount)}${corners.tr}`)}`;
  const bottomBorder = s.dim(`${corners.bl}${corners.h.repeat(innerWidth)}${corners.br}`);

  const lines = [topBorder];
  for (const row of rawRows) {
    const padRight = Math.max(0, innerWidth - 2 - row.visibleLen);
    lines.push(`${s.dim(corners.v)} ${row.rendered}${' '.repeat(padRight)} ${s.dim(corners.v)}`);
  }
  lines.push(bottomBorder);

  return lines.join('\n');
}

/**
 * Render a horizontal section divider rule for batch items and attempts.
 */
export function renderSectionRule(title: string, options?: { color?: boolean; width?: number }): string {
  const color = options?.color ?? false;
  const width = options?.width ?? 76;
  const s = createStyler(color);
  const label = ` ${stripAnsi(title).trim()} `;
  const trailingLen = Math.max(4, width - 2 - label.length);
  return `${s.dim('──')}${s.cyan(s.bold(label))}${s.dim('─'.repeat(trailingLen))}`;
}

/**
 * Render an aligned table whose column widths account for ANSI escape sequences.
 */
export function renderTable(
  headers: readonly string[],
  rows: readonly (readonly string[])[],
  options?: { align?: readonly UiTableAlign[]; color?: boolean; indent?: string }
): string {
  const color = options?.color ?? false;
  const indent = options?.indent ?? '  ';
  const align = options?.align ?? [];
  const s = createStyler(color);

  const widths = headers.map((h, colIdx) => {
    let maxW = stripAnsi(h).length;
    for (const row of rows) {
      const cell = row[colIdx] ?? '';
      maxW = Math.max(maxW, stripAnsi(cell).length);
    }
    return maxW;
  });

  const formatRow = (cells: readonly string[], isHeader = false): string => {
    const formatted = headers.map((_, idx) => {
      const cell = cells[idx] ?? '';
      const padded = padVisible(cell, widths[idx], isHeader ? 'left' : (align[idx] ?? 'left'));
      return isHeader ? s.dim(s.bold(padded)) : padded;
    });
    return `${indent}${formatted.join('  ')}`.trimEnd();
  };

  const dividerWidth = widths.reduce((sum, w) => sum + w, 0) + Math.max(0, widths.length - 1) * 2;
  const lines = [formatRow(headers, true), `${indent}${s.dim('─'.repeat(dividerWidth))}`];
  for (const row of rows) {
    lines.push(formatRow(row, false));
  }
  return lines.join('\n');
}

/**
 * Prefix verbose runner output lines with a subtle dimmed gutter bar.
 */
export function formatGutterLines(chunk: string, options?: { color?: boolean; prefix?: string }): string {
  const color = options?.color ?? false;
  const prefix = options?.prefix ?? '│ ';
  const s = createStyler(color);
  const gutter = s.dim(prefix);

  return chunk
    .split(/(\r?\n)/)
    .map(part => {
      if (part === '\n' || part === '\r\n' || part === '') {
        return part;
      }
      return `${gutter}${part}`;
    })
    .join('');
}

/**
 * Extract the latest concise, human-readable status/tool line from raw runner output.
 */
export function extractRunnerActivityLine(chunk: string, maxChars = 68): string | null {
  const clean = stripAnsi(chunk);
  const lines = clean.split(/\r?\n/);

  for (let i = lines.length - 1; i >= 0; i--) {
    const trimmed = lines[i].trim().replace(/\s+/g, ' ');
    if (trimmed.length < 4) {
      continue;
    }
    if (
      /^[{}[\]<>/|@+-]/.test(trimmed) ||
      /^"[^"]+"\s*:/.test(trimmed) ||
      /^```/.test(trimmed) ||
      /^=+$/.test(trimmed) ||
      /^> build /.test(trimmed) ||
      /^Command exited with code/.test(trimmed) ||
      /^PID:\s*\d+/i.test(trimmed) ||
      /^Output is streaming to:/i.test(trimmed)
    ) {
      continue;
    }
    const withoutBullet = trimmed.replace(/^[→←✱✗$%•]+\s*/, '').trim();
    if (withoutBullet.length < 4) {
      continue;
    }
    return truncateText(withoutBullet, maxChars);
  }

  return null;
}

/**
 * Create a single-line animated spinner on TTY streams with clean non-TTY fallback.
 */
export function createSpinner(options?: {
  stream?: UiStream;
  quiet?: boolean;
  color?: boolean;
  indent?: string;
}): SpinnerHandle {
  const stream = options?.stream ?? process.stderr;
  const quiet = Boolean(options?.quiet);
  const color = options?.color ?? supportsColor(stream);
  const indent = options?.indent ?? '  ';
  const tty = isInteractiveTty(stream);
  const s = createStyler(color);

  let timer: ReturnType<typeof setInterval> | null = null;
  let frameIdx = 0;
  let currentText = '';
  let active = false;

  const clearLine = (): void => {
    if (tty) {
      stream.write(`\r${ESC}[2K`);
    }
  };

  const renderFrame = (): void => {
    if (!tty || !active || quiet) {
      return;
    }
    const frame = s.cyan(SPINNER_FRAMES[frameIdx % SPINNER_FRAMES.length]);
    frameIdx++;
    clearLine();
    stream.write(`${indent}${frame} ${currentText}`);
  };

  const stopTimer = (): void => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    active = false;
  };

  const settle = (icon: string, text: string): void => {
    if (quiet) {
      stopTimer();
      return;
    }
    stopTimer();
    clearLine();
    stream.write(`${indent}${icon} ${text}\n`);
  };

  return {
    start: (text: string): void => {
      if (quiet) return;
      currentText = text;
      if (tty) {
        stopTimer();
        active = true;
        renderFrame();
        timer = setInterval(renderFrame, 100);
        timer.unref?.();
      } else {
        active = true;
        stream.write(`${indent}${s.dim('⋯')} ${text}\n`);
      }
    },
    update: (text: string): void => {
      if (quiet || !active) return;
      currentText = text;
      if (tty) {
        renderFrame();
      }
    },
    succeed: (text: string): void => settle(s.green('✔'), text),
    fail: (text: string): void => settle(s.red('✖'), text),
    skip: (text: string): void => settle(s.yellow('○'), text),
    info: (text: string): void => settle(s.cyan('•'), text),
    stop: (): void => {
      stopTimer();
      if (!quiet && active) {
        clearLine();
      } else {
        clearLine();
      }
    },
  };
}
