import { DELIVERY } from "@/config";

// Lima está en UTC-5 todo el año (sin horario de verano).
const LIMA_OFFSET_MS = -5 * 60 * 60 * 1000;

const DAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const DAYS_SHORT = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** Fecha de hoy en Lima, formato YYYY-MM-DD. */
export function todayLima(now = new Date()): string {
  return new Date(now.getTime() + LIMA_OFFSET_MS).toISOString().slice(0, 10);
}

function parse(date: string): Date {
  return new Date(`${date}T12:00:00Z`);
}

export function addDays(date: string, days: number): string {
  const d = parse(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function weekdayOf(date: string): number {
  return parse(date).getUTCDay();
}

export function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && parse(date).toISOString().slice(0, 10) === date;
}

/** Momento (UTC) en que se cierran los pedidos para una fecha de entrega. */
export function cutoffFor(date: string): Date {
  const previous = addDays(date, -1);
  const hour = String(DELIVERY.cutoffHourPreviousDay).padStart(2, "0");
  return new Date(`${previous}T${hour}:00:00-05:00`);
}

export function isOpenForOrders(date: string, now = new Date()): boolean {
  return now.getTime() < cutoffFor(date).getTime();
}

/** Fechas en las que todavía se puede pedir. */
export function availableDates(now = new Date()): string[] {
  const today = todayLima(now);
  const dates: string[] = [];
  for (let i = 1; i <= DELIVERY.daysAhead; i++) {
    const date = addDays(today, i);
    if (DELIVERY.weekdays.includes(weekdayOf(date)) && isOpenForOrders(date, now)) {
      dates.push(date);
    }
  }
  return dates;
}

export function dayName(weekday: number): string {
  return DAYS[weekday];
}

/** "martes" → "martes", "sábado" → "sábados". */
export function dayNamePlural(weekday: number): string {
  const day = DAYS[weekday];
  return day.endsWith("s") ? day : `${day}s`;
}

export function formatDateLong(date: string): string {
  const d = parse(date);
  return `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} de ${MONTHS[d.getUTCMonth()]}`;
}

export function formatDateShort(date: string): { day: string; num: number; month: string } {
  const d = parse(date);
  return {
    day: DAYS_SHORT[d.getUTCDay()],
    num: d.getUTCDate(),
    month: MONTHS[d.getUTCMonth()].slice(0, 3),
  };
}

export function formatCutoff(date: string): string {
  const previous = addDays(date, -1);
  return `${DAYS[weekdayOf(previous)]} a las ${DELIVERY.cutoffHourPreviousDay}:00`;
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function isValidSlot(time: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(time)) return false;
  const minutes = toMinutes(time);
  return (
    minutes >= toMinutes(DELIVERY.firstSlot) &&
    minutes <= toMinutes(DELIVERY.lastSlot) &&
    minutes % DELIVERY.slotStepMinutes === 0
  );
}

export function slotOptions(): string[] {
  const slots: string[] = [];
  for (
    let m = toMinutes(DELIVERY.firstSlot);
    m <= toMinutes(DELIVERY.lastSlot);
    m += DELIVERY.slotStepMinutes
  ) {
    slots.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return slots;
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h < 12 ? "a. m." : "p. m.";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}
