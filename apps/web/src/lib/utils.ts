import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import objectSupport from "dayjs/plugin/objectSupport";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(objectSupport);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function padWithZero(num: number) {
  // Convert number to string
  let numStr = num.toString();
  // Pad with zero if the length of numStr is less than 2
  return numStr.padStart(2, "0");
}

export function convertTimeToTargetTimezone(
  timeString: string,
  targetZone: string,
  sourceZone: string | undefined = undefined,
) {
  // Parse hours and minutes from the time string "hh:mm"
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

  // Create a new Date object set to current date and time
  let date: dayjs.Dayjs;
  if (sourceZone) {
    date = dayjs.tz({ hour, minute, seconds: 0 }, sourceZone);
  } else {
    date = dayjs.utc({ hour, minute, seconds: 0 });
  }

  // Convert the time to the target timezone
  const targetDate = date.tz(targetZone);

  return { hours: targetDate.hour(), minutes: targetDate.minute() };
}
