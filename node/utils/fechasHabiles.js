// Utilidades para cálculo de días hábiles en Colombia (excluyendo fines de semana y festivos)

export function getEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function nextMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  if (day === 1) return date;
  const diff = (day === 0 ? 1 : 8 - day);
  date.setDate(date.getDate() + diff);
  return date;
}

function addDays(d, days) {
  const res = new Date(d);
  res.setDate(res.getDate() + days);
  return res;
}

const holidaysCache = new Map();

export function getColombianHolidays(year) {
  if (holidaysCache.has(year)) {
    return holidaysCache.get(year);
  }

  const holidays = [
    new Date(year, 0, 1),                    // Año Nuevo
    nextMonday(new Date(year, 0, 6)),        // Reyes Magos
    nextMonday(new Date(year, 2, 19)),       // San José
    new Date(year, 4, 1),                    // Día del Trabajo
    nextMonday(new Date(year, 5, 29)),       // San Pedro y San Pablo
    new Date(year, 6, 20),                   // Independencia
    new Date(year, 7, 7),                    // Batalla de Boyacá
    nextMonday(new Date(year, 7, 15)),       // Asunción de la Virgen
    nextMonday(new Date(year, 9, 12)),       // Día de la Raza
    nextMonday(new Date(year, 10, 1)),       // Todos los Santos
    nextMonday(new Date(year, 10, 11)),      // Independencia de Cartagena
    new Date(year, 11, 8),                   // Inmaculada Concepción
    new Date(year, 11, 25)                   // Navidad
  ];

  const easter = getEaster(year);
  holidays.push(addDays(easter, -3));               // Jueves Santo
  holidays.push(addDays(easter, -2));               // Viernes Santo
  holidays.push(nextMonday(addDays(easter, 39)));    // Ascensión del Señor
  holidays.push(nextMonday(addDays(easter, 60)));    // Corpus Christi
  holidays.push(nextMonday(addDays(easter, 68)));    // Sagrado Corazón

  const holidaySet = new Set(
    holidays.map(d => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${dd}`;
    })
  );

  holidaysCache.set(year, holidaySet);
  return holidaySet;
}

export const esFestivoOFinDeSemana = (dateInput) => {
  if (!dateInput) return false;
  let yyyy, mm, dd, day;

  if (dateInput instanceof Date) {
    yyyy = dateInput.getFullYear();
    mm = dateInput.getMonth() + 1;
    dd = dateInput.getDate();
    day = dateInput.getDay();
  } else {
    const parts = String(dateInput).substring(0, 10).split("-").map(Number);
    yyyy = parts[0];
    mm = parts[1];
    dd = parts[2];
    day = new Date(yyyy, mm - 1, dd).getDay();
  }

  // Fin de semana (0 = domingo, 6 = sábado)
  if (day === 0 || day === 6) return true;

  // Festivo en Colombia
  const holidaySet = getColombianHolidays(yyyy);
  const formatted = `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
  return holidaySet.has(formatted);
};

export const esDiaHabil = (dateInput) => {
  return !esFestivoOFinDeSemana(dateInput);
};

export const sumarDiasHabiles = (dateStr, dias) => {
  if (!dateStr) return "";
  const [yyyy, mm, dd] = dateStr.split("-").map(Number);
  const fecha = new Date(yyyy, mm - 1, dd);
  let diasAgregados = 0;

  while (diasAgregados < dias) {
    fecha.setDate(fecha.getDate() + 1);
    if (esDiaHabil(fecha)) {
      diasAgregados++;
    }
  }

  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, '0');
  const d = String(fecha.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const diffDiasHabiles = (fechaA, fechaB) => {
  if (!fechaA || !fechaB) return 0;
  const [yA, mA, dA] = fechaA.split("-").map(Number);
  const [yB, mB, dB] = fechaB.split("-").map(Number);
  let a = new Date(yA, mA - 1, dA);
  const b = new Date(yB, mB - 1, dB);

  a.setHours(0, 0, 0, 0);
  b.setHours(0, 0, 0, 0);

  if (a.getTime() === b.getTime()) return 0;

  let diasHabiles = 0;
  const inc = a < b ? 1 : -1;
  const curr = new Date(a);

  while (curr.getTime() !== b.getTime()) {
    curr.setDate(curr.getDate() + inc);
    if (esDiaHabil(curr)) {
      diasHabiles += inc;
    }
  }
  return diasHabiles;
};

export const hoyStr = () => {
  const hoy = new Date();
  const y = hoy.getFullYear();
  const m = String(hoy.getMonth() + 1).padStart(2, '0');
  const d = String(hoy.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
