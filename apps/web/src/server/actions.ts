import { convertTimeToUTC } from "@/lib/utils";
import { db } from "./db";

export async function updatePreferredTime(userId: number, formData: FormData) {
  "use server";
  const preferredTime = formData.get("preferredTime") as string; // in format HH:mm
  const timezone = formData.get("timezone") as string;
  // convert hours and minute to UTC
  const { hours, minutes } = convertTimeToUTC(preferredTime, timezone);
  await db.user.update({
    where: { id: userId },
    data: {
      preferredSendHourUtc: hours,
      preferredSendMinuteUtc: minutes,
      timezone,
    },
  });
}
