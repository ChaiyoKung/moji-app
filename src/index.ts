import "../global.css";

// Register app entry through Expo Router
import "expo-router/entry";

import dayjs from "dayjs";
import "dayjs/locale/th";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { LocaleConfig } from "react-native-calendars";
import "./libs/calendar-locale-config.th";

dayjs.locale("th");
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(utc);
dayjs.extend(timezone);

LocaleConfig.defaultLocale = "th";
