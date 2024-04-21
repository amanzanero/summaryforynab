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
  // if preselected timezone, sort the list so that it appears first, otherwise make userTimezone the first
  // element in the list
  const resortedTimezones = preselectedTimezone
    ? [
        preselectedTimezone,
        ...timezones.filter((timezone) => timezone !== preselectedTimezone),
      ]
    : [
        userTimezone,
        ...timezones.filter((timezone) => timezone !== userTimezone),
      ];
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
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
