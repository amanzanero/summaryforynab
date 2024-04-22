import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePreferredTime } from "@/server/actions";
import { db } from "@/server/db";
import { TimezoneSelect } from "./timezoneSelect";
import { timezones } from "./timezones";
import { convertTimeToTargetTimezone, padWithZero } from "@/lib/utils";

export default async function Page(): Promise<JSX.Element> {
  const user = await db.user.findUnique({
    where: { email: "info@amanzanero.com" },
  });
  if (!user) {
    return (
      <main>
        <div className="text-base">Not found!</div>
      </main>
    );
  }
  const { hours, minutes } = convertTimeToTargetTimezone(
    `${user.preferredSendHourUtc}:${user.preferredSendMinuteUtc}`,
    user.timezone,
  );
  const updatePreferredTimeWithId = updatePreferredTime.bind(null, user.id);
  return (
    <div className="text-base">
      Hey, {user.email}. The following is your preferred time.
      <form
        action={updatePreferredTimeWithId}
        className="flex flex-col w-full space-y-4"
      >
        <div className="flex flex-col space-y-1">
          <label htmlFor="preferredTime">Preferred Time</label>
          <div className="flex space-x-2">
            <Input
              type="time"
              id="preferredTime"
              name="preferredTime"
              className="w-full"
              defaultValue={`${padWithZero(hours)}:${padWithZero(minutes)}`}
            />
            <TimezoneSelect
              timezones={[...new Set(timezones.flatMap((tz) => tz.utc))].sort()}
              preselectedTimezone={user.timezone}
            />
          </div>
        </div>
        <Button type="submit">Update</Button>
      </form>
    </div>
  );
}
