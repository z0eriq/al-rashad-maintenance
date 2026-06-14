import prisma from "./prisma";

function getBookingPrefix(bookingCode: string, date = new Date()): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yy = date.getFullYear().toString().slice(-2);
  return `${bookingCode}${mm}${yy}`;
}

function nextSequenceFromNumbers(bookingNumbers: string[], prefix: string): number {
  const suffixPrefix = `${prefix}-`;

  return bookingNumbers.reduce((max, bookingNumber) => {
    if (!bookingNumber.startsWith(suffixPrefix)) return max;

    const sequence = Number.parseInt(bookingNumber.slice(suffixPrefix.length), 10);
    return Number.isFinite(sequence) ? Math.max(max, sequence) : max;
  }, -1) + 1;
}

export async function generateBookingNumber(serviceId: string): Promise<string> {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: { bookingCode: true },
  });

  const code = service?.bookingCode || "X";
  const prefix = getBookingPrefix(code);

  const existing = await prisma.appointment.findMany({
    where: {
      serviceId,
      bookingNumber: { startsWith: `${prefix}-` },
    },
    select: { bookingNumber: true },
  });

  const sequence = nextSequenceFromNumbers(
    existing.map((item) => item.bookingNumber),
    prefix
  );

  return `${prefix}-${sequence}`;
}
