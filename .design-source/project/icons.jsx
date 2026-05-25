// Inline SVG icons. Lucide-style strokes.
const I = (paths, viewBox = '0 0 24 24') => ({ size = 18, ...props } = {}) =>
  React.createElement('svg', {
    width: size, height: size, viewBox,
    fill: 'none', stroke: 'currentColor',
    strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
    ...props,
  }, paths);

const p = (d, key, extra) => React.createElement('path', { d, key, ...(extra || {}) });
const c = (cx, cy, r, key) => React.createElement('circle', { cx, cy, r, key });
const ln = (x1, y1, x2, y2, key) => React.createElement('line', { x1, y1, x2, y2, key });
const rect = (x, y, w, h, rx, key) => React.createElement('rect', { x, y, width: w, height: h, rx, key });

window.Icons = {
  Dashboard: I([
    rect(3, 3, 7, 9, 1.5, 'a'),
    rect(14, 3, 7, 5, 1.5, 'b'),
    rect(14, 12, 7, 9, 1.5, 'c'),
    rect(3, 16, 7, 5, 1.5, 'd'),
  ]),
  Invoice: I([
    p('M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z', 'a'),
    p('M15 3v4h4', 'b'),
    ln(9, 12, 16, 12, 'c'),
    ln(9, 16, 14, 16, 'd'),
  ]),
  Quote: I([
    p('M5 5h11l4 4v9.5A2.5 2.5 0 0 1 17.5 21H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z', 'a'),
    p('M16 5v4h4', 'b'),
    p('M8 14c0-1 .8-2 2-2', 'c'),
    p('M13 14c0-1 .8-2 2-2', 'd'),
  ]),
  Users: I([
    c(9, 8, 4, 'a'),
    p('M3 21c0-3.3 2.7-6 6-6s6 2.7 6 6', 'b'),
    p('M16 4a4 4 0 0 1 0 8', 'c'),
    p('M21 21c0-2.5-1.4-4.7-3.5-5.7', 'd'),
  ]),
  Card: I([
    rect(2, 6, 20, 13, 2, 'a'),
    ln(2, 11, 22, 11, 'b'),
    ln(6, 15, 10, 15, 'c'),
  ]),
  Chart: I([
    p('M3 3v18h18', 'a'),
    p('M7 14l4-4 3 3 5-7', 'b'),
  ]),
  Settings: I([
    c(12, 12, 3, 'a'),
    p('M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z', 'b'),
  ]),
  Search: I([
    c(11, 11, 7, 'a'),
    p('M21 21l-4.3-4.3', 'b'),
  ]),
  Plus: I([ ln(12, 5, 12, 19, 'a'), ln(5, 12, 19, 12, 'b') ]),
  Filter: I([ p('M3 5h18l-7 9v6l-4-2v-4z', 'a') ]),
  Download: I([
    p('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'a'),
    p('M7 10l5 5 5-5', 'b'),
    ln(12, 15, 12, 3, 'c'),
  ]),
  Send: I([
    p('M22 2L11 13', 'a'),
    p('M22 2l-7 20-4-9-9-4z', 'b'),
  ]),
  More: I([ c(5, 12, 1.4, 'a'), c(12, 12, 1.4, 'b'), c(19, 12, 1.4, 'c') ]),
  ChevronRight: I([ p('M9 6l6 6-6 6', 'a') ]),
  ChevronLeft: I([ p('M15 6l-6 6 6 6', 'a') ]),
  ChevronDown: I([ p('M6 9l6 6 6-6', 'a') ]),
  ArrowUp: I([ p('M7 17L17 7', 'a'), p('M7 7h10v10', 'b') ]),
  ArrowDown: I([ p('M17 7L7 17', 'a'), p('M17 17H7V7', 'b') ]),
  Check: I([ p('M5 12l5 5L20 7', 'a') ]),
  X: I([ ln(6, 6, 18, 18, 'a'), ln(18, 6, 6, 18, 'b') ]),
  Trash: I([
    p('M4 7h16', 'a'),
    p('M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13', 'b'),
    p('M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2', 'c'),
  ]),
  Edit: I([
    p('M12 20h9', 'a'),
    p('M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z', 'b'),
  ]),
  Mail: I([
    rect(2, 5, 20, 14, 2, 'a'),
    p('M2 7l10 7 10-7', 'b'),
  ]),
  Phone: I([
    p('M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.9 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z', 'a'),
  ]),
  Bell: I([
    p('M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9', 'a'),
    p('M13.7 21a2 2 0 0 1-3.4 0', 'b'),
  ]),
  Copy: I([
    rect(9, 9, 11, 11, 2, 'a'),
    p('M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1', 'b'),
  ]),
  Eye: I([
    p('M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z', 'a'),
    c(12, 12, 3, 'b'),
  ]),
  Receipt: I([
    p('M4 3v18l2-1.5L8 21l2-1.5L12 21l2-1.5L16 21l2-1.5L20 21V3l-2 1.5L16 3l-2 1.5L12 3l-2 1.5L8 3 6 4.5z', 'a'),
    ln(8, 9, 16, 9, 'b'),
    ln(8, 13, 16, 13, 'c'),
  ]),
  Calendar: I([
    rect(3, 4, 18, 17, 2, 'a'),
    ln(8, 2, 8, 6, 'b'),
    ln(16, 2, 16, 6, 'c'),
    ln(3, 10, 21, 10, 'd'),
  ]),
  Building: I([
    p('M3 21V7a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14', 'a'),
    p('M11 21V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v18', 'b'),
    ln(15, 8, 17, 8, 'c'),
    ln(15, 12, 17, 12, 'd'),
    ln(15, 16, 17, 16, 'e'),
    ln(6, 12, 8, 12, 'f'),
    ln(6, 16, 8, 16, 'g'),
  ]),
  Sparkle: I([
    p('M12 3l1.7 4.6L18 9.3l-4.3 1.7L12 15l-1.7-4L6 9.3l4.3-1.7z', 'a'),
    p('M19 16l.7 1.8L21 18.5l-1.3.7L19 21l-.7-1.8L17 18.5l1.3-.7z', 'b'),
  ]),
  Repeat: I([
    p('M17 2l4 4-4 4', 'a'),
    p('M3 12V8a2 2 0 0 1 2-2h16', 'b'),
    p('M7 22l-4-4 4-4', 'c'),
    p('M21 12v4a2 2 0 0 1-2 2H3', 'd'),
  ]),
  Pause: I([ rect(6, 4, 4, 16, 1, 'a'), rect(14, 4, 4, 16, 1, 'b') ]),
  Play: I([ p('M6 4l14 8-14 8z', 'a') ]),
  Lock: I([
    rect(4, 11, 16, 11, 2, 'a'),
    p('M8 11V7a4 4 0 0 1 8 0v4', 'b'),
  ]),
  Shield: I([
    p('M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z', 'a'),
  ]),
  Globe: I([
    c(12, 12, 9, 'a'),
    p('M3 12h18', 'b'),
    p('M12 3a13 13 0 0 1 0 18 13 13 0 0 1 0-18', 'c'),
  ]),
  ExternalLink: I([
    p('M15 3h6v6', 'a'),
    p('M10 14L21 3', 'b'),
    p('M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5', 'c'),
  ]),
  Wallet: I([
    p('M21 12V8a2 2 0 0 0-2-2H5a2 2 0 0 1 0-4h14v4', 'a'),
    rect(3, 6, 18, 14, 2, 'b'),
    c(17, 13, 1.5, 'c'),
  ]),
  Logo: ({ size = 32 } = {}) => React.createElement('svg', {
    width: size, height: size, viewBox: '0 0 32 32', fill: 'none',
  }, [
    React.createElement('path', { key: 'b', d: 'M7 6h14l4 4v16H7z', fill: 'currentColor', opacity: 0.18 }),
    React.createElement('path', { key: 'c', d: 'M7 6h14l4 4v16H7z M21 6v4h4', stroke: 'currentColor', strokeWidth: 1.8, fill: 'none', strokeLinejoin: 'round' }),
    React.createElement('path', { key: 'd', d: 'M11 14h10M11 18h10M11 22h7', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' }),
  ]),
};
