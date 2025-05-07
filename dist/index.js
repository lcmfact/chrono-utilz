"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  CalendarDate: () => CalendarDate,
  DateWise: () => DateWise,
  DateWiseError: () => DateWiseError,
  addTime: () => addTime,
  createDate: () => createDate,
  default: () => index_default,
  endOf: () => endOf,
  formatDate: () => formatDate,
  getDateDiff: () => getDateDiff,
  getDayOfYear: () => getDayOfYear,
  getDaysInMonth: () => getDaysInMonth,
  getRelativeTime: () => getRelativeTime,
  getTimezoneOffset: () => getTimezoneOffset,
  getTimezoneString: () => getTimezoneString,
  getWeekOfYear: () => getWeekOfYear,
  isBetweenDates: () => isBetweenDates,
  isLeapYear: () => isLeapYear,
  isValidDate: () => isValidDate,
  parseDate: () => parseDate,
  startOf: () => startOf,
  subtractTime: () => subtractTime,
  toUTC: () => toUTC,
  utcNow: () => utcNow,
  validateDateFormat: () => validateDateFormat
});
module.exports = __toCommonJS(index_exports);
var DateWiseError = class _DateWiseError extends Error {
  constructor(message) {
    super(`DateWise Error: ${message}`);
    this.name = "DateWiseError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _DateWiseError);
    }
  }
};
function parseDate(input, options = {}) {
  const { throwError = false, fallback = null } = options;
  try {
    if (input instanceof Date) {
      const date = new Date(input.getTime());
      if (isNaN(date.getTime())) throw new DateWiseError("Invalid Date object");
      return date;
    }
    if (typeof input === "number") {
      const date = new Date(input);
      if (isNaN(date.getTime())) throw new DateWiseError(`Invalid timestamp: ${input}`);
      return date;
    }
    if (typeof input !== "string") {
      throw new DateWiseError("Invalid input type for date");
    }
    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december"
    ];
    const slashFormat = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const slashMatch = input.match(slashFormat);
    if (slashMatch) {
      const [, first, second, yearStr] = slashMatch;
      const year = parseInt(yearStr, 10);
      const month = parseInt(first, 10);
      const day = parseInt(second, 10);
      const date = new Date(year, month - 1, day);
      if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
        return date;
      }
      const altDay = month;
      const altMonth = day;
      const altDate = new Date(year, altMonth - 1, altDay);
      if (altDate.getFullYear() === year && altDate.getMonth() === altMonth - 1 && altDate.getDate() === altDay) {
        return altDate;
      }
    }
    const ddMmmYyyy = /^(\d{1,2})\s+([a-zA-Z]{3,})\s+(\d{4})$/;
    const match1 = input.match(ddMmmYyyy);
    if (match1) {
      const [, dayStr, monthStr, yearStr] = match1;
      const day = parseInt(dayStr, 10);
      const year = parseInt(yearStr, 10);
      const monthIndex = months.findIndex((m) => m.startsWith(monthStr.toLowerCase().slice(0, 3)));
      if (monthIndex !== -1) {
        const date = new Date(year, monthIndex, day);
        if (date.getFullYear() === year && date.getMonth() === monthIndex && date.getDate() === day) {
          return date;
        }
      }
    }
    const mmmDdYyyy = /^([a-zA-Z]{3,})\s+(\d{1,2})(?:,)?\s+(\d{4})$/;
    const match2 = input.match(mmmDdYyyy);
    if (match2) {
      const [, monthStr, dayStr, yearStr] = match2;
      const day = parseInt(dayStr, 10);
      const year = parseInt(yearStr, 10);
      const monthIndex = months.findIndex((m) => m.startsWith(monthStr.toLowerCase().slice(0, 3)));
      if (monthIndex !== -1) {
        const date = new Date(year, monthIndex, day);
        if (date.getFullYear() === year && date.getMonth() === monthIndex && date.getDate() === day) {
          return date;
        }
      }
    }
    const isoDate = new Date(input);
    if (!isNaN(isoDate.getTime())) {
      const [yyyy, mm, dd] = isoDate.toISOString().split("T")[0].split("-").map(Number);
      if (isoDate.getFullYear() === yyyy && isoDate.getMonth() === mm - 1 && isoDate.getDate() === dd) {
        return isoDate;
      }
    }
    throw new DateWiseError(`Unable to parse date: ${input}`);
  } catch (error) {
    if (throwError) {
      throw error instanceof DateWiseError ? error : new DateWiseError(`Failed to parse date: ${input}`);
    }
    return fallback;
  }
}
function formatDate(date, format = "YYYY-MM-DD") {
  const safeDate = parseDate(date, { throwError: true });
  if (!safeDate) {
    throw new DateWiseError("Invalid date provided to formatDate");
  }
  const year = safeDate.getFullYear();
  const month = safeDate.getMonth() + 1;
  const day = safeDate.getDate();
  const hours24 = safeDate.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = safeDate.getMinutes();
  const seconds = safeDate.getSeconds();
  const ampm = hours24 >= 12 ? "PM" : "AM";
  const pad = (num) => num.toString().padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  switch (format) {
    case "YYYY-MM-DD":
      return `${year}-${pad(month)}-${pad(day)}`;
    case "MM/DD/YYYY":
      return `${pad(month)}/${pad(day)}/${year}`;
    case "DD/MM/YYYY":
      return `${pad(day)}/${pad(month)}/${year}`;
    case "YYYY-MM-DD HH:mm:ss":
      return `${year}-${pad(month)}-${pad(day)} ${pad(hours24)}:${pad(minutes)}:${pad(seconds)}`;
    case "DD MMM YYYY":
      return `${pad(day)} ${monthNames[safeDate.getMonth()]} ${year}`;
    case "MMM DD, YYYY":
      return `${monthNames[safeDate.getMonth()]} ${pad(day)}, ${year}`;
    case "HH:mm:ss":
      return `${pad(hours24)}:${pad(minutes)}:${pad(seconds)}`;
    case "hh:mm A":
      return `${pad(hours12)}:${pad(minutes)} ${ampm}`;
    default:
      throw new DateWiseError(`Unsupported date format: ${format}`);
  }
}
function addTime(date, amount, unit) {
  const safeDate = parseDate(date, { throwError: true });
  if (!safeDate) {
    throw new DateWiseError("Invalid date provided to addTime");
  }
  const result = new Date(safeDate.getTime());
  switch (unit) {
    case "millisecond":
      result.setMilliseconds(result.getMilliseconds() + amount);
      break;
    case "second":
      result.setSeconds(result.getSeconds() + amount);
      break;
    case "minute":
      result.setMinutes(result.getMinutes() + amount);
      break;
    case "hour":
      result.setHours(result.getHours() + amount);
      break;
    case "day":
      result.setDate(result.getDate() + amount);
      break;
    case "week":
      result.setDate(result.getDate() + amount * 7);
      break;
    case "month":
      result.setMonth(result.getMonth() + amount);
      break;
    case "year":
      result.setFullYear(result.getFullYear() + amount);
      break;
    default:
      throw new DateWiseError(`Invalid time unit: ${unit}`);
  }
  return result;
}
function subtractTime(date, amount, unit) {
  return addTime(date, -amount, unit);
}
function getDateDiff(date1, date2, unit) {
  const safeDate1 = parseDate(date1, { throwError: true });
  const safeDate2 = parseDate(date2, { throwError: true });
  if (!safeDate1 || !safeDate2) {
    throw new DateWiseError("Invalid date(s) provided to getDateDiff");
  }
  const diffMs = safeDate1.getTime() - safeDate2.getTime();
  switch (unit) {
    case "millisecond":
      return diffMs;
    case "second":
      return Math.floor(diffMs / 1e3);
    case "minute":
      return Math.floor(diffMs / (1e3 * 60));
    case "hour":
      return Math.floor(diffMs / (1e3 * 60 * 60));
    case "day":
      return Math.floor(diffMs / (1e3 * 60 * 60 * 24));
    case "week":
      return Math.floor(diffMs / (1e3 * 60 * 60 * 24 * 7));
    case "month": {
      const d1Year = safeDate1.getFullYear();
      const d2Year = safeDate2.getFullYear();
      const d1Month = safeDate1.getMonth();
      const d2Month = safeDate2.getMonth();
      return (d1Year - d2Year) * 12 + (d1Month - d2Month);
    }
    case "year": {
      const d1Year = safeDate1.getFullYear();
      const d2Year = safeDate2.getFullYear();
      const monthAdjustment = (safeDate1.getMonth() - safeDate2.getMonth()) / 12;
      return d1Year - d2Year + monthAdjustment;
    }
    default:
      throw new DateWiseError(`Invalid time unit: ${unit}`);
  }
}
function isBetweenDates(date, startDate, endDate, inclusive = true) {
  const safeDate = parseDate(date, { throwError: true });
  const safeStartDate = parseDate(startDate, { throwError: true });
  const safeEndDate = parseDate(endDate, { throwError: true });
  if (!safeDate || !safeStartDate || !safeEndDate) {
    throw new DateWiseError("Invalid date(s) provided to isBetweenDates");
  }
  const dateTime = safeDate.getTime();
  const startTime = safeStartDate.getTime();
  const endTime = safeEndDate.getTime();
  if (inclusive) {
    return dateTime >= startTime && dateTime <= endTime;
  } else {
    return dateTime > startTime && dateTime < endTime;
  }
}
function isValidDate(date) {
  const parsedDate = parseDate(date, { throwError: false });
  return parsedDate !== null;
}
function startOf(date, unit) {
  const safeDate = parseDate(date, { throwError: true });
  if (!safeDate) {
    throw new DateWiseError("Invalid date provided to startOf");
  }
  const result = new Date(safeDate.getTime());
  switch (unit) {
    case "hour":
      result.setMinutes(0, 0, 0);
      break;
    case "day":
      result.setHours(0, 0, 0, 0);
      break;
    case "week": {
      const dayOfWeek = result.getDay();
      result.setDate(result.getDate() - dayOfWeek);
      result.setHours(0, 0, 0, 0);
      break;
    }
    case "month":
      result.setDate(1);
      result.setHours(0, 0, 0, 0);
      break;
    case "year":
      result.setMonth(0, 1);
      result.setHours(0, 0, 0, 0);
      break;
    default:
      throw new DateWiseError(`Invalid time unit for startOf: ${unit}`);
  }
  return result;
}
function endOf(date, unit) {
  const safeDate = parseDate(date, { throwError: true });
  if (!safeDate) {
    throw new DateWiseError("Invalid date provided to endOf");
  }
  const result = new Date(safeDate.getTime());
  switch (unit) {
    case "hour":
      result.setMinutes(59, 59, 999);
      break;
    case "day":
      result.setHours(23, 59, 59, 999);
      break;
    case "week": {
      const dayOfWeek = result.getDay();
      result.setDate(result.getDate() + (6 - dayOfWeek));
      result.setHours(23, 59, 59, 999);
      break;
    }
    case "month": {
      result.setMonth(result.getMonth() + 1, 0);
      result.setHours(23, 59, 59, 999);
      break;
    }
    case "year":
      result.setMonth(11, 31);
      result.setHours(23, 59, 59, 999);
      break;
    default:
      throw new DateWiseError(`Invalid time unit for endOf: ${unit}`);
  }
  return result;
}
function getDayOfYear(date) {
  const safeDate = parseDate(date, { throwError: true });
  if (!safeDate) {
    throw new DateWiseError("Invalid date provided to getDayOfYear");
  }
  const startOfYear = new Date(safeDate.getFullYear(), 0, 0);
  const diff = safeDate.getTime() - startOfYear.getTime();
  const oneDay = 1e3 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}
function getWeekOfYear(date) {
  const safeDate = parseDate(date, { throwError: true });
  if (!safeDate) {
    throw new DateWiseError("Invalid date provided to getWeekOfYear");
  }
  const target = new Date(safeDate.valueOf());
  const dayNr = (safeDate.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 1);
  if (firstThursday.getDay() !== 4) {
    firstThursday.setMonth(0, 1 + (4 - firstThursday.getDay() + 7) % 7);
  }
  const weekDiff = (target.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1e3);
  return 1 + Math.floor(weekDiff);
}
function isLeapYear(year) {
  let yearToCheck;
  if (typeof year === "number") {
    yearToCheck = year;
  } else {
    const safeDate = parseDate(year, { throwError: true });
    if (!safeDate) {
      throw new DateWiseError("Invalid date provided to isLeapYear");
    }
    yearToCheck = safeDate.getFullYear();
  }
  return yearToCheck % 4 === 0 && yearToCheck % 100 !== 0 || yearToCheck % 400 === 0;
}
function getDaysInMonth(date) {
  const safeDate = parseDate(date, { throwError: true });
  if (!safeDate) {
    throw new DateWiseError("Invalid date provided to getDaysInMonth");
  }
  return new Date(safeDate.getFullYear(), safeDate.getMonth() + 1, 0).getDate();
}
function getRelativeTime(date, baseDate = /* @__PURE__ */ new Date()) {
  const safeDate = parseDate(date, { throwError: true });
  const safeBaseDate = parseDate(baseDate, { throwError: true });
  if (!safeDate || !safeBaseDate) {
    throw new DateWiseError("Invalid date(s) provided to getRelativeTime");
  }
  const deltaMs = safeDate.getTime() - safeBaseDate.getTime();
  const isPast = deltaMs < 0;
  const absDelta = Math.abs(deltaMs);
  const deltaSeconds = Math.round(absDelta / 1e3);
  const format = (value, unit) => {
    const plural = value !== 1 ? "s" : "";
    return isPast ? `${value} ${unit}${plural} ago` : `in ${value} ${unit}${plural}`;
  };
  if (deltaSeconds < 5) return "just now";
  if (deltaSeconds < 60) return format(deltaSeconds, "second");
  if (deltaSeconds < 3600) return format(Math.floor(deltaSeconds / 60), "minute");
  if (deltaSeconds < 86400) return format(Math.floor(deltaSeconds / 3600), "hour");
  if (deltaSeconds < 604800) return format(Math.floor(deltaSeconds / 86400), "day");
  if (deltaSeconds < 2629800) return format(Math.floor(deltaSeconds / 604800), "week");
  const from = new Date(safeBaseDate.getFullYear(), safeBaseDate.getMonth(), safeBaseDate.getDate());
  const to = new Date(safeDate.getFullYear(), safeDate.getMonth(), safeDate.getDate());
  const years = to.getFullYear() - from.getFullYear();
  const months = to.getMonth() - from.getMonth();
  let totalMonths = years * 12 + months;
  if (to.getDate() < from.getDate()) {
    totalMonths -= 1;
  }
  if (Math.abs(totalMonths) >= 12) {
    return format(Math.floor(Math.abs(totalMonths) / 12), "year");
  }
  return format(Math.abs(totalMonths), "month");
}
function getTimezoneOffset(date = /* @__PURE__ */ new Date()) {
  const safeDate = parseDate(date, { throwError: true });
  if (!safeDate) {
    throw new DateWiseError("Invalid date provided to getTimezoneOffset");
  }
  return safeDate.getTimezoneOffset();
}
function createDate(year, month, day, hours = 0, minutes = 0, seconds = 0, milliseconds = 0) {
  if (month < 0 || month > 11) {
    throw new DateWiseError(`Month must be between 0 and 11, got ${month}`);
  }
  const date = new Date(year, month, day, hours, minutes, seconds, milliseconds);
  if (isNaN(date.getTime())) {
    throw new DateWiseError("Invalid date components provided to createDate");
  }
  if (date.getMonth() !== month) {
    throw new DateWiseError(`Invalid day ${day} for month ${month}`);
  }
  return date;
}
var CalendarDate = class _CalendarDate {
  /**
   * Creates a new CalendarDate
   * @param year - The year
   * @param month - The month (1-12)
   * @param day - The day (1-31)
   */
  constructor(year, month, day) {
    const internalMonth = month - 1;
    const date = createDate(year, internalMonth, day);
    this._year = date.getFullYear();
    this._month = date.getMonth();
    this._day = date.getDate();
  }
  /**
   * Creates a CalendarDate from a Date object
   * @param date - The Date object
   * @returns A new CalendarDate
   */
  static fromDate(date) {
    return new _CalendarDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
  }
  /**
   * Creates a CalendarDate from a string or timestamp
   * @param input - The input to parse
   * @returns A new CalendarDate
   */
  static fromString(input) {
    const date = parseDate(input, { throwError: true });
    if (!date) {
      throw new DateWiseError("Invalid date provided to CalendarDate.fromString");
    }
    return _CalendarDate.fromDate(date);
  }
  /**
   * Gets the year
   */
  get year() {
    return this._year;
  }
  /**
   * Gets the month (1-12)
   */
  get month() {
    return this._month + 1;
  }
  /**
   * Gets the day (1-31)
   */
  get day() {
    return this._day;
  }
  /**
   * Converts to a JavaScript Date object (at midnight local time)
   * @returns A new Date object
   */
  toDate() {
    return new Date(this._year, this._month, this._day, 0, 0, 0, 0);
  }
  /**
   * Returns an ISO date string (YYYY-MM-DD)
   * @returns ISO date string
   */
  toString() {
    return formatDate(this.toDate(), "YYYY-MM-DD");
  }
  /**
   * Adds time to this calendar date
   * @param amount - The amount to add
   * @param unit - The time unit (limited to day, week, month, year)
   * @returns A new CalendarDate
   */
  add(amount, unit) {
    const newDate = addTime(this.toDate(), amount, unit);
    return _CalendarDate.fromDate(newDate);
  }
  /**
   * Checks if this calendar date is equal to another
   * @param other - The other calendar date
   * @returns True if the dates are equal
   */
  equals(other) {
    return this._year === other._year && this._month === other._month && this._day === other._day;
  }
  /**
   * Compares this calendar date with another
   * @param other - The other calendar date
   * @returns Negative if this < other, 0 if equal, positive if this > other
   */
  compare(other) {
    if (this._year !== other._year) {
      return this._year - other._year;
    }
    if (this._month !== other._month) {
      return this._month - other._month;
    }
    return this._day - other._day;
  }
  /**
   * Checks if this calendar date is before another
   * @param other - The other calendar date
   * @returns True if this date is before the other
   */
  isBefore(other) {
    return this.compare(other) < 0;
  }
  /**
   * Checks if this calendar date is after another
   * @param other - The other calendar date
   * @returns True if this date is after the other
   */
  isAfter(other) {
    return this.compare(other) > 0;
  }
};
function utcNow() {
  const now = /* @__PURE__ */ new Date();
  return new Date(now.getTime() + now.getTimezoneOffset() * 6e4);
}
function toUTC(date) {
  const safeDate = parseDate(date, { throwError: true });
  if (!safeDate) {
    throw new DateWiseError("Invalid date provided to toUTC");
  }
  return new Date(
    safeDate.getTime() + safeDate.getTimezoneOffset() * 6e4
  );
}
function getTimezoneString() {
  const offset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
  const sign = offset <= 0 ? "+" : "-";
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;
  return `UTC${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}
function validateDateFormat(dateStr, format) {
  let match;
  switch (format) {
    case "YYYY-MM-DD":
      match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!match) return false;
      break;
    case "MM/DD/YYYY": {
      match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!match) return false;
      const [, mm1, dd1, yyyy1] = match.map(Number);
      if (mm1 < 1 || mm1 > 12 || dd1 < 1 || dd1 > 31) return false;
      return (/* @__PURE__ */ new Date(`${yyyy1}-${String(mm1).padStart(2, "0")}-${String(dd1).padStart(2, "0")}`)).getMonth() === mm1 - 1;
    }
    case "DD/MM/YYYY": {
      match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!match) return false;
      const [, dd2, mm2, yyyy2] = match.map(Number);
      if (mm2 < 1 || mm2 > 12 || dd2 < 1 || dd2 > 31) return false;
      return (/* @__PURE__ */ new Date(`${yyyy2}-${String(mm2).padStart(2, "0")}-${String(dd2).padStart(2, "0")}`)).getDate() === dd2;
    }
    case "YYYY-MM-DD HH:mm:ss":
      match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
      if (!match) return false;
      break;
    case "DD MMM YYYY":
      match = dateStr.match(/^(\d{1,2}) ([A-Za-z]{3}) (\d{4})$/);
      if (!match) return false;
      break;
    case "MMM DD, YYYY":
      match = dateStr.match(/^([A-Za-z]{3}) (\d{1,2}), (\d{4})$/);
      if (!match) return false;
      break;
    case "HH:mm:ss": {
      match = dateStr.match(/^(\d{2}):(\d{2}):(\d{2})$/);
      if (!match) return false;
      const [, h1, m1, s1] = match.map(Number);
      return h1 < 24 && m1 < 60 && s1 < 60;
    }
    case "hh:mm A": {
      match = dateStr.match(/^(\d{1,2}):(\d{2}) ([AP]M)$/);
      if (!match) return false;
      const hour = parseInt(match[1], 10);
      const minute = parseInt(match[2], 10);
      return hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59;
    }
    default:
      return false;
  }
  try {
    const date = parseDate(dateStr);
    return date !== null && !isNaN(date.getTime());
  } catch (e) {
    return false;
  }
}
var DateWise = {
  parseDate,
  formatDate,
  addTime,
  subtractTime,
  getDateDiff,
  isBetweenDates,
  isValidDate,
  startOf,
  endOf,
  getDayOfYear,
  getWeekOfYear,
  isLeapYear,
  getDaysInMonth,
  getRelativeTime,
  getTimezoneOffset,
  createDate,
  CalendarDate,
  utcNow,
  toUTC,
  getTimezoneString,
  validateDateFormat
};
var index_default = DateWise;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CalendarDate,
  DateWise,
  DateWiseError,
  addTime,
  createDate,
  endOf,
  formatDate,
  getDateDiff,
  getDayOfYear,
  getDaysInMonth,
  getRelativeTime,
  getTimezoneOffset,
  getTimezoneString,
  getWeekOfYear,
  isBetweenDates,
  isLeapYear,
  isValidDate,
  parseDate,
  startOf,
  subtractTime,
  toUTC,
  utcNow,
  validateDateFormat
});
