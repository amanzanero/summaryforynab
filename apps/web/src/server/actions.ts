import { convertTimeToTargetTimezone } from "@/lib/utils";
import { db } from "./db";

export async function updatePreferredTime(formData: FormData) {
  "use server";
  const preferredTime = formData.get("preferredTime") as string; // in format HH:mm
  const timezone = formData.get("timezone") as string;
  // convert hours and minute to UTC
  const { hours, minutes } = convertTimeToTargetTimezone(
    preferredTime,
    "UTC",
    timezone,
  );
  await db.user.update({
    where: { email: "info@amanzanero.com" },
    data: {
      preferredSendHourUtc: hours,
      preferredSendMinuteUtc: minutes,
      timezone,
    },
  });
}
