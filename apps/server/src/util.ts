import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import objectSupport from "dayjs/plugin/objectSupport.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(objectSupport);

export const classnames = (...args: (string | undefined)[]) => {
  return args.filter((arg) => !!arg).join(" ");
};

export const utcNow = () => {
  return dayjs.utc();
};
