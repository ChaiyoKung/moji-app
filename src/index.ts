import "../global.css";

// Register app entry through Expo Router
import "expo-router/entry";

import dayjs from "dayjs";
import "dayjs/locale/th";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";

dayjs.locale("th");
dayjs.extend(isToday);
dayjs.extend(isYesterday);
