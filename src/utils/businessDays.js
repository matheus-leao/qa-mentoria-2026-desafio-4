/**
 * Calcula data_devolucao: 15 dias úteis (seg–sex) após data_emprestimo,
 * conforme requisitos (sábados e domingos não entram na contagem).
 * @param {Date} startDate
 * @returns {Date}
 */
export function addWeekdaysAfter(startDate, weekdays = 15) {
  const d = new Date(startDate);
  d.setHours(0, 0, 0, 0);
  let added = 0;
  while (added < weekdays) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d;
}

/**
 * Dias corridos restantes até a data (fim do dia de devolução).
 * @param {Date} from
 * @param {Date} until
 */
export function diasRestantesCorridos(from, until) {
  const a = new Date(from);
  a.setHours(0, 0, 0, 0);
  const b = new Date(until);
  b.setHours(0, 0, 0, 0);
  const diff = Math.round((b - a) / 86400000);
  return Math.max(0, diff);
}

export function formatDateISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
