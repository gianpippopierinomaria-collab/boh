const Calc = (() => {
  function avg(grades) {
    const nums = (grades || []).map((g) => Number(g.value)).filter((n) => !Number.isNaN(n));
    if (!nums.length) return null;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  }

  function formatAvg(value) {
    if (value == null || Number.isNaN(value)) return '—';
    const rounded = Math.round(value * 10) / 10;
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  }

  function formatVote(value) {
    const n = Number(value);
    if (Number.isNaN(n)) return '';
    return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
  }

  function band(value) {
    const n = Number(value);
    if (n < 5) return 'bad';
    if (n < 6) return 'low';
    if (n < 7) return 'mid';
    if (n < 8) return 'good';
    return 'high';
  }

  function failRatio(grades) {
    if (!grades.length) return 0;
    return grades.filter((g) => Number(g.value) < 6).length / grades.length;
  }

  function overlaps(lessons, item) {
    const start = item.start;
    const end = item.end;
    const weekday = Number(item.weekday);
    return (lessons || []).filter((other) => other.id !== item.id && Number(other.weekday) === weekday && start < other.end && other.start < end);
  }

  function validRange(start, end) {
    return Boolean(start && end && start < end);
  }

  return { avg, formatAvg, formatVote, band, failRatio, overlaps, validRange };
})();
