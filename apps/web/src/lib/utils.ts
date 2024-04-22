import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function padWithZero(num: number) {
  // Convert number to string
  let numStr = num.toString();
  // Pad with zero if the length of numStr is less than 2
  return numStr.padStart(2, "0");
}

function validateTime(timeString: string) {
  // Parse hours and minutes from the time string "HH:mm"
  const [hour, minute] = timeString.split(":").map(Number);
  if (
    hour === undefined ||
    minute === undefined ||
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new TypeError("Invalid time string");
  }
}

// Function to convert time in "HH:mm" format from variable timezone to UTC
export function convertTimeToUTC(timeStr: string, fromTimezone: string) {
  validateTime(timeStr);
  // Get the current date in the source timezone
  const currentDateInTimezone = dayjs().tz(fromTimezone);

  // Construct datetime string with the current date and input time
  const datetimeStr =
    currentDateInTimezone.format("YYYY-MM-DD") + `T${timeStr}:00`;

  // Parse datetime string with the specified timezone
  const inputTime = dayjs.tz(
    datetimeStr,
    `${currentDateInTimezone.format("YYYY-MM-DD")}THH:mm:ss`,
    fromTimezone,
  );
  // Set timezone of input time
  const timeInTimezone = inputTime.tz(fromTimezone);

  // Convert to UTC
  const utcTime = timeInTimezone.utc();

  // Return time in "HH:mm" UTC format
  return { hours: utcTime.hour(), minutes: utcTime.minute() };
}

// Function to convert time in "HH:mm" format from UTC to variable timezone
export function convertTimeFromUTC(timeStr: string, toTimezone: string) {
  // Get the current date in UTC
  const currentDateInUTC = dayjs.utc();

  // Construct datetime string with the current date in UTC and input time
  const datetimeStr = currentDateInUTC.format("YYYY-MM-DD") + `T${timeStr}:00`;

  // Parse datetime string in UTC
  const utcTime = dayjs.utc(
    datetimeStr,
    `${currentDateInUTC.format("YYYY-MM-DD")}THH:mm:ss`,
  );

  // Convert to the specified timezone
  const timeInTimezone = utcTime.tz(toTimezone);

  // Return time in "HH:mm" format for the specified timezone
  return { hours: timeInTimezone.hour(), minutes: timeInTimezone.minute() };
}
