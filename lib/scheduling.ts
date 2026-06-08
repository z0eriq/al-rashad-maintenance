/** إعدادات جدولة المواعيد */
export const SLOT_INTERVAL = 30;
export const MAX_BOOKING_MINUTES = 120;
/** السعة القصوى لكل فترة نصف ساعة (وحدات) */
export const MAX_SLOT_CAPACITY = 4;
/** رمز خدمة تبديل الزيت والفلاتر */
export const OIL_FILTER_BOOKING_CODE = "Z";
/** كل حجز زيت يستهلك وحدتين (سيارتان = حجز واحد) */
export const OIL_FILTER_CAPACITY_UNITS = 2;

const MORNING = { start: "08:00", end: "12:30" };
const AFTERNOON = { start: "14:00", end: "16:00" };

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function generateRange(start: string, end: string): string[] {
  const slots: string[] = [];
  let current = timeToMinutes(start);
  const endMin = timeToMinutes(end);
  while (current <= endMin) {
    slots.push(minutesToTime(current));
    current += SLOT_INTERVAL;
  }
  return slots;
}

export function generateTimeSlots(): string[] {
  return [...generateRange(MORNING.start, MORNING.end), ...generateRange(AFTERNOON.start, AFTERNOON.end)];
}

export function parseDateOnly(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isFriday(dateStr: string): boolean {
  return parseDateOnly(dateStr).getDay() === 5;
}

export function isBookableDay(dateStr: string): boolean {
  return parseDateOnly(dateStr).getDay() !== 5;
}

export function getBookingDuration(serviceDuration: number): number {
  return Math.min(Math.max(serviceDuration, SLOT_INTERVAL), MAX_BOOKING_MINUTES);
}

/** وحدات السعة التي يستهلكها حجز واحد */
export function getBookingCapacityUnits(bookingCode: string): number {
  return bookingCode === OIL_FILTER_BOOKING_CODE ? OIL_FILTER_CAPACITY_UNITS : 1;
}

export function getUsedCapacityAtTime(
  appointments: { time: string; bookingCode: string }[],
  time: string
): number {
  return appointments
    .filter((a) => a.time === time)
    .reduce((sum, a) => sum + getBookingCapacityUnits(a.bookingCode), 0);
}

export function hasCapacityAtTime(
  time: string,
  bookingCode: string,
  appointments: { time: string; bookingCode: string }[]
): boolean {
  const used = getUsedCapacityAtTime(appointments, time);
  const needed = getBookingCapacityUnits(bookingCode);
  return used + needed <= MAX_SLOT_CAPACITY;
}

export function getAvailableStartSlots(
  bookingCode: string,
  bookedAppointments: { time: string; bookingCode: string }[],
  options?: { isToday?: boolean; now?: Date }
): string[] {
  const allSlots = generateTimeSlots();
  const now = options?.now || new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return allSlots.filter((start) => {
    if (!hasCapacityAtTime(start, bookingCode, bookedAppointments)) return false;

    if (options?.isToday) {
      const startMin = timeToMinutes(start);
      if (startMin <= nowMinutes) return false;
    }
    return true;
  });
}

export function hasScheduleConflict(
  startTime: string,
  bookingCode: string,
  bookedAppointments: { time: string; bookingCode: string }[]
): boolean {
  return !hasCapacityAtTime(startTime, bookingCode, bookedAppointments);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} دقيقة`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h} ساعة و ${m} دقيقة` : `${h} ساعة`;
}
