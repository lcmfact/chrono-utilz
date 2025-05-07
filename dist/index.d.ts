/**
 * DateWise - A lightweight date utility library
 * Provides common date operations with focus on performance and bundle size
 * Compatible with TypeScript, JavaScript and Node.js
 * @module DateWise
 */
/**
 * DateFormat options for formatting dates
 */
type DateFormat = 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD HH:mm:ss' | 'DD MMM YYYY' | 'MMM DD, YYYY' | 'HH:mm:ss' | 'hh:mm A';
/**
 * TimeUnit for duration calculations
 */
type TimeUnit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
/**
 * DateWise options for parsing dates
 */
interface DateParseOptions {
    /**
     * Whether to throw an error if the date is invalid
     */
    throwError?: boolean;
    /**
     * The fallback date to use if parsing fails
     */
    fallback?: Date | null;
}
/**
 * DateWise error class
 */
declare class DateWiseError extends Error {
    constructor(message: string);
}
/**
 * Safely parses a date string or timestamp into a Date object
 * @param input - The input to parse as a date
 * @param options - Parsing options
 * @returns A Date object or null if invalid and throwError is false
 * @throws {DateWiseError} If the date is invalid and throwError is true
 */
declare function parseDate(input: string | number | Date, options?: DateParseOptions): Date | null;
/**
 * Formats a date according to the specified format
 * @param date - The date to format
 * @param format - The format pattern
 * @returns Formatted date string
 * @throws {DateWiseError} If the date is invalid
 */
declare function formatDate(date: Date | string | number, format?: DateFormat): string;
/**
 * Adds time to a date
 * @param date - The base date
 * @param amount - The amount to add
 * @param unit - The time unit
 * @returns A new Date with the added time
 */
declare function addTime(date: Date | string | number, amount: number, unit: TimeUnit): Date;
/**
 * Subtracts time from a date
 * @param date - The base date
 * @param amount - The amount to subtract
 * @param unit - The time unit
 * @returns A new Date with the subtracted time
 */
declare function subtractTime(date: Date | string | number, amount: number, unit: TimeUnit): Date;
/**
 * Gets the difference between two dates in the specified unit
 * @param date1 - The first date
 * @param date2 - The second date
 * @param unit - The time unit
 * @returns The difference in the specified unit
 */
declare function getDateDiff(date1: Date | string | number, date2: Date | string | number, unit: TimeUnit): number;
/**
 * Checks if a date is between two other dates
 * @param date - The date to check
 * @param startDate - The start date
 * @param endDate - The end date
 * @param inclusive - Whether to include the boundaries
 * @returns True if the date is between the start and end dates
 */
declare function isBetweenDates(date: Date | string | number, startDate: Date | string | number, endDate: Date | string | number, inclusive?: boolean): boolean;
/**
 * Validates whether a given input is a valid date in supported formats.
 * Checks if a date is valid
 * @param date - The date to check
 * @returns True if the date is valid
 */
declare function isValidDate(date: any): boolean;
/**
 * Gets the start of a time unit (e.g., start of day, start of month)
 * @param date - The reference date
 * @param unit - The time unit
 * @returns A new Date representing the start of the specified unit
 */
declare function startOf(date: Date | string | number, unit: Exclude<TimeUnit, 'millisecond' | 'second' | 'minute'>): Date;
/**
 * Gets the end of a time unit (e.g., end of day, end of month)
 * @param date - The reference date
 * @param unit - The time unit
 * @returns A new Date representing the end of the specified unit
 */
declare function endOf(date: Date | string | number, unit: Exclude<TimeUnit, 'millisecond' | 'second' | 'minute'>): Date;
/**
 * Gets the day of the year (1-366)
 * @param date - The date
 * @returns The day of the year
 */
declare function getDayOfYear(date: Date | string | number): number;
/**
 * Gets the week of the year (1-53)
 * @param date - The date
 * @returns The week of the year
 */
declare function getWeekOfYear(date: Date | string | number): number;
/**
 * Checks if a year is a leap year
 * @param year - The year to check or a date
 * @returns True if the year is a leap year
 */
declare function isLeapYear(year: number | Date | string): boolean;
/**
 * Gets the number of days in a month
 * @param date - The reference date
 * @returns The number of days in the month
 */
declare function getDaysInMonth(date: Date | string | number): number;
/**
 * Returns a relative time string (e.g., "5 minutes ago", "in 2 days")
 * @param date - The date to get relative time for
 * @param baseDate - The base date (defaults to now)
 * @returns A human-readable relative time string
 */
declare function getRelativeTime(date: Date | string | number, baseDate?: Date | string | number): string;
/**
 * Gets the timezone offset in minutes
 * @param date - The date to get timezone offset for
 * @returns Timezone offset in minutes
 */
declare function getTimezoneOffset(date?: Date | string | number): number;
/**
 * Creates a date from components
 * @param year - The year
 * @param month - The month (0-11)
 * @param day - The day (1-31)
 * @param hours - The hours (0-23)
 * @param minutes - The minutes (0-59)
 * @param seconds - The seconds (0-59)
 * @param milliseconds - The milliseconds (0-999)
 * @returns A new Date object
 */
declare function createDate(year: number, month: number, day: number, hours?: number, minutes?: number, seconds?: number, milliseconds?: number): Date;
/**
 * A calendar date without time information
 */
declare class CalendarDate {
    private _year;
    private _month;
    private _day;
    /**
     * Creates a new CalendarDate
     * @param year - The year
     * @param month - The month (1-12)
     * @param day - The day (1-31)
     */
    constructor(year: number, month: number, day: number);
    /**
     * Creates a CalendarDate from a Date object
     * @param date - The Date object
     * @returns A new CalendarDate
     */
    static fromDate(date: Date): CalendarDate;
    /**
     * Creates a CalendarDate from a string or timestamp
     * @param input - The input to parse
     * @returns A new CalendarDate
     */
    static fromString(input: string | number): CalendarDate;
    /**
     * Gets the year
     */
    get year(): number;
    /**
     * Gets the month (1-12)
     */
    get month(): number;
    /**
     * Gets the day (1-31)
     */
    get day(): number;
    /**
     * Converts to a JavaScript Date object (at midnight local time)
     * @returns A new Date object
     */
    toDate(): Date;
    /**
     * Returns an ISO date string (YYYY-MM-DD)
     * @returns ISO date string
     */
    toString(): string;
    /**
     * Adds time to this calendar date
     * @param amount - The amount to add
     * @param unit - The time unit (limited to day, week, month, year)
     * @returns A new CalendarDate
     */
    add(amount: number, unit: Extract<TimeUnit, 'day' | 'week' | 'month' | 'year'>): CalendarDate;
    /**
     * Checks if this calendar date is equal to another
     * @param other - The other calendar date
     * @returns True if the dates are equal
     */
    equals(other: CalendarDate): boolean;
    /**
     * Compares this calendar date with another
     * @param other - The other calendar date
     * @returns Negative if this < other, 0 if equal, positive if this > other
     */
    compare(other: CalendarDate): number;
    /**
     * Checks if this calendar date is before another
     * @param other - The other calendar date
     * @returns True if this date is before the other
     */
    isBefore(other: CalendarDate): boolean;
    /**
     * Checks if this calendar date is after another
     * @param other - The other calendar date
     * @returns True if this date is after the other
     */
    isAfter(other: CalendarDate): boolean;
}
/**
 * Gets the current UTC date and time
 * @returns The current UTC date and time
 */
declare function utcNow(): Date;
/**
 * Converts a date to UTC
 * @param date - The date to convert
 * @returns A new Date in UTC
 */
declare function toUTC(date: Date | string | number): Date;
/**
 * Gets a string representation of the current timezone
 * @returns Timezone string (e.g., "UTC+2")
 */
declare function getTimezoneString(): string;
/**
 * Validates if a date string matches a specific format
 * @param dateStr - The date string to validate
 * @param format - The expected format
 * @returns True if the date string matches the format and is valid
 */
declare function validateDateFormat(dateStr: string, format: DateFormat): boolean;
/**
 * DateWise namespace - contains all DateWise exports for easy access
 */
declare const DateWise: {
    parseDate: typeof parseDate;
    formatDate: typeof formatDate;
    addTime: typeof addTime;
    subtractTime: typeof subtractTime;
    getDateDiff: typeof getDateDiff;
    isBetweenDates: typeof isBetweenDates;
    isValidDate: typeof isValidDate;
    startOf: typeof startOf;
    endOf: typeof endOf;
    getDayOfYear: typeof getDayOfYear;
    getWeekOfYear: typeof getWeekOfYear;
    isLeapYear: typeof isLeapYear;
    getDaysInMonth: typeof getDaysInMonth;
    getRelativeTime: typeof getRelativeTime;
    getTimezoneOffset: typeof getTimezoneOffset;
    createDate: typeof createDate;
    CalendarDate: typeof CalendarDate;
    utcNow: typeof utcNow;
    toUTC: typeof toUTC;
    getTimezoneString: typeof getTimezoneString;
    validateDateFormat: typeof validateDateFormat;
};

export { CalendarDate, type DateFormat, type DateParseOptions, DateWise, DateWiseError, type TimeUnit, addTime, createDate, DateWise as default, endOf, formatDate, getDateDiff, getDayOfYear, getDaysInMonth, getRelativeTime, getTimezoneOffset, getTimezoneString, getWeekOfYear, isBetweenDates, isLeapYear, isValidDate, parseDate, startOf, subtractTime, toUTC, utcNow, validateDateFormat };
