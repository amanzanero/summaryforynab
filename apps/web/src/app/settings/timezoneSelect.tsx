"use client";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface TimezoneDropdownProps {
  timezones: string[];
  preselectedTimezone: string | null;
}

export const TimezoneSelect = ({
  timezones,
  preselectedTimezone,
}: TimezoneDropdownProps) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // resort list to have preselected first, and detected timezone second in the list
  const resortedTimezones = timezones.sort((a, b) => {
    if (a === preselectedTimezone) {
      return -1;
    }
    if (b === preselectedTimezone) {
      return 1;
    }
    if (a === userTimezone) {
      return -1;
    }
    if (b === userTimezone) {
      return 1;
    }
    // otherwise alphabetic
    return a.localeCompare(b);
  });
  return (
    <Select name="timezone" defaultValue={preselectedTimezone ?? userTimezone}>
      <SelectTrigger>
        <SelectValue
          placeholder="Select a timezone"
          defaultValue={preselectedTimezone ?? userTimezone}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Timezone</SelectLabel>
          {resortedTimezones.map((tz) => {
            return (
              <SelectItem key={tz} value={tz}>
                {tz}
                {preselectedTimezone !== userTimezone && tz === userTimezone ? (
                  <span className="font-bold">&nbsp;(detected)</span>
                ) : null}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
