
/**
 * ChronoUtilz - A lightweight date utility library
 * Provides common date operations with focus on performance and bundle size
 * Compatible with TypeScript, JavaScript and Node.js
 * @module ChronoUtilz
 */

/**
 * DateFormat options for formatting dates
 */
export type DateFormat =
    | 'YYYY-MM-DD'           // 2025-05-07
    | 'MM/DD/YYYY'           // 05/07/2025
    | 'DD/MM/YYYY'           // 07/05/2025
    | 'YYYY-MM-DD HH:mm:ss'  // 2025-05-07 14:30:00
    | 'DD MMM YYYY'          // 07 May 2025
    | 'MMM DD, YYYY'         // May 07, 2025
    | 'HH:mm:ss'             // 14:30:00
    | 'hh:mm A';             // 02:30 PM

/**
 * TimeUnit for duration calculations
 */
export type TimeUnit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

/**
 * ChronoUtilz options for parsing dates
 */
export interface DateParseOptions {
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
 * ChronoUtilz error class
 */
export class ChronoUtilzError extends Error {
    constructor(message: string) {
        super(`ChronoUtilz Error: ${message}`);
        this.name = 'ChronoUtilzError';

        // Support proper stack traces in modern environments
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ChronoUtilzError);
        }
    }
}

/**
 * Safely parses a date string or timestamp into a Date object
 * @param input - The input to parse as a date
 * @param options - Parsing options
 * @returns A Date object or null if invalid and throwError is false
 * @throws {ChronoUtilzError} If the date is invalid and throwError is true
 */
export function parseDate(input: string | number | Date, options: DateParseOptions = {}): Date | null {
    const { throwError = false, fallback = null } = options;

    try {
        if (input instanceof Date) {
            const date = new Date(input.getTime());
            if (isNaN(date.getTime())) throw new ChronoUtilzError('Invalid Date object');
            return date;
        }

        if (typeof input === 'number') {
            const date = new Date(input);
            if (isNaN(date.getTime())) throw new ChronoUtilzError(`Invalid timestamp: ${input}`);
            return date;
        }

        if (typeof input !== 'string') {
            throw new ChronoUtilzError('Invalid input type for date');
        }

        const months = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
        ];

        // MM/DD/YYYY or DD/MM/YYYY
        const slashFormat = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        const slashMatch = input.match(slashFormat);
        if (slashMatch) {
            const [, first, second, yearStr] = slashMatch;
            const year = parseInt(yearStr, 10);

            // Try MM/DD/YYYY
            const month = parseInt(first, 10);
            const day = parseInt(second, 10);
            const date = new Date(year, month - 1, day);
            if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
                return date;
            }

            // Try DD/MM/YYYY fallback
            const altDay = month;
            const altMonth = day;
            const altDate = new Date(year, altMonth - 1, altDay);
            if (altDate.getFullYear() === year && altDate.getMonth() === altMonth - 1 && altDate.getDate() === altDay) {
                return altDate;
            }
        }

        // DD MMM YYYY
        const ddMmmYyyy = /^(\d{1,2})\s+([a-zA-Z]{3,})\s+(\d{4})$/;
        const match1 = input.match(ddMmmYyyy);
        if (match1) {
            const [, dayStr, monthStr, yearStr] = match1;
            const day = parseInt(dayStr, 10);
            const year = parseInt(yearStr, 10);
            const monthIndex = months.findIndex(m => m.startsWith(monthStr.toLowerCase().slice(0, 3)));

            if (monthIndex !== -1) {
                const date = new Date(year, monthIndex, day);
                if (date.getFullYear() === year && date.getMonth() === monthIndex && date.getDate() === day) {
                    return date;
                }
            }
        }

        // MMM DD, YYYY
        const mmmDdYyyy = /^([a-zA-Z]{3,})\s+(\d{1,2})(?:,)?\s+(\d{4})$/;
        const match2 = input.match(mmmDdYyyy);
        if (match2) {
            const [, monthStr, dayStr, yearStr] = match2;
            const day = parseInt(dayStr, 10);
            const year = parseInt(yearStr, 10);
            const monthIndex = months.findIndex(m => m.startsWith(monthStr.toLowerCase().slice(0, 3)));

            if (monthIndex !== -1) {
                const date = new Date(year, monthIndex, day);
                if (date.getFullYear() === year && date.getMonth() === monthIndex && date.getDate() === day) {
                    return date;
                }
            }
        }

        // Fallback to ISO string parse
        const isoDate = new Date(input);
        if (!isNaN(isoDate.getTime())) {
            const [yyyy, mm, dd] = isoDate.toISOString().split('T')[0].split('-').map(Number);
            if (isoDate.getFullYear() === yyyy && isoDate.getMonth() === mm - 1 && isoDate.getDate() === dd) {
                return isoDate;
            }
        }

        throw new ChronoUtilzError(`Unable to parse date: ${input}`);
    } catch (error) {
        if (throwError) {
            throw error instanceof ChronoUtilzError ? error : new ChronoUtilzError(`Failed to parse date: ${input}`);
        }
        return fallback;
    }
}

/**
 * Formats a date according to the specified format
 * @param date - The date to format
 * @param format - The format pattern
 * @returns Formatted date string
 * @throws {ChronoUtilzError} If the date is invalid
 */
export function formatDate(date: Date | string | number, format: DateFormat = 'YYYY-MM-DD'): string {
    const safeDate = parseDate(date, { throwError: true });
    if (!safeDate) {
        throw new ChronoUtilzError('Invalid date provided to formatDate');
    }

    const year = safeDate.getFullYear();
    const month = safeDate.getMonth() + 1;
    const day = safeDate.getDate();
    const hours24 = safeDate.getHours();
    const hours12 = hours24 % 12 || 12;
    const minutes = safeDate.getMinutes();
    const seconds = safeDate.getSeconds();
    const ampm = hours24 >= 12 ? 'PM' : 'AM';

    const pad = (num: number): string => num.toString().padStart(2, '0');

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    switch (format) {
        case 'YYYY-MM-DD':
            return `${year}-${pad(month)}-${pad(day)}`;
        case 'MM/DD/YYYY':
            return `${pad(month)}/${pad(day)}/${year}`;
        case 'DD/MM/YYYY':
            return `${pad(day)}/${pad(month)}/${year}`;
        case 'YYYY-MM-DD HH:mm:ss':
            return `${year}-${pad(month)}-${pad(day)} ${pad(hours24)}:${pad(minutes)}:${pad(seconds)}`;
        case 'DD MMM YYYY':
            return `${pad(day)} ${monthNames[safeDate.getMonth()]} ${year}`;
        case 'MMM DD, YYYY':
            return `${monthNames[safeDate.getMonth()]} ${pad(day)}, ${year}`;
        case 'HH:mm:ss':
            return `${pad(hours24)}:${pad(minutes)}:${pad(seconds)}`;
        case 'hh:mm A':
            return `${pad(hours12)}:${pad(minutes)} ${ampm}`;
        default:
            throw new ChronoUtilzError(`Unsupported date format: ${format}`);
    }
}

/**
 * Adds time to a date
 * @param date - The base date
 * @param amount - The amount to add
 * @param unit - The time unit
 * @returns A new Date with the added time
 */
export function addTime(
    date: Date | string | number,
    amount: number,
    unit: TimeUnit
): Date {
    const safeDate = parseDate(date, { throwError: true });
    if (!safeDate) {
        throw new ChronoUtilzError('Invalid date provided to addTime');
    }

    const result = new Date(safeDate.getTime());

    switch (unit) {
        case 'millisecond':
            result.setMilliseconds(result.getMilliseconds() + amount);
            break;
        case 'second':
            result.setSeconds(result.getSeconds() + amount);
            break;
        case 'minute':
            result.setMinutes(result.getMinutes() + amount);
            break;
        case 'hour':
            result.setHours(result.getHours() + amount);
            break;
        case 'day':
            result.setDate(result.getDate() + amount);
            break;
        case 'week':
            result.setDate(result.getDate() + (amount * 7));
            break;
        case 'month':
            result.setMonth(result.getMonth() + amount);
            break;
        case 'year':
            result.setFullYear(result.getFullYear() + amount);
            break;
        default:
            throw new ChronoUtilzError(`Invalid time unit: ${unit}`);
    }

    return result;
}

/**
 * Subtracts time from a date
 * @param date - The base date
 * @param amount - The amount to subtract
 * @param unit - The time unit
 * @returns A new Date with the subtracted time
 */
export function subtractTime(
    date: Date | string | number,
    amount: number,
    unit: TimeUnit
): Date {
    return addTime(date, -amount, unit);
}

/**
 * Gets the difference between two dates in the specified unit
 * @param date1 - The first date
 * @param date2 - The second date
 * @param unit - The time unit
 * @returns The difference in the specified unit
 */
export function getDateDiff(
    date1: Date | string | number,
    date2: Date | string | number,
    unit: TimeUnit
): number {
    const safeDate1 = parseDate(date1, { throwError: true });
    const safeDate2 = parseDate(date2, { throwError: true });

    if (!safeDate1 || !safeDate2) {
        throw new ChronoUtilzError('Invalid date(s) provided to getDateDiff');
    }

    const diffMs = safeDate1.getTime() - safeDate2.getTime();

    switch (unit) {
        case 'millisecond':
            return diffMs;
        case 'second':
            return Math.floor(diffMs / 1000);
        case 'minute':
            return Math.floor(diffMs / (1000 * 60));
        case 'hour':
            return Math.floor(diffMs / (1000 * 60 * 60));
        case 'day':
            return Math.floor(diffMs / (1000 * 60 * 60 * 24));
        case 'week':
            return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
        case 'month': {
            // More accurate month and year calculations
            const d1Year = safeDate1.getFullYear();
            const d2Year = safeDate2.getFullYear();
            const d1Month = safeDate1.getMonth();
            const d2Month = safeDate2.getMonth();

            return (d1Year - d2Year) * 12 + (d1Month - d2Month);
        }
        case 'year': {
            const d1Year = safeDate1.getFullYear();
            const d2Year = safeDate2.getFullYear();
            const monthAdjustment = (safeDate1.getMonth() - safeDate2.getMonth()) / 12;
            return d1Year - d2Year + monthAdjustment;
        }
        default:
            throw new ChronoUtilzError(`Invalid time unit: ${unit}`);
    }
}

/**
 * Checks if a date is between two other dates
 * @param date - The date to check
 * @param startDate - The start date
 * @param endDate - The end date
 * @param inclusive - Whether to include the boundaries
 * @returns True if the date is between the start and end dates
 */
export function isBetweenDates(
    date: Date | string | number,
    startDate: Date | string | number,
    endDate: Date | string | number,
    inclusive = true
): boolean {
    const safeDate = parseDate(date, { throwError: true });
    const safeStartDate = parseDate(startDate, { throwError: true });
    const safeEndDate = parseDate(endDate, { throwError: true });

    if (!safeDate || !safeStartDate || !safeEndDate) {
        throw new ChronoUtilzError('Invalid date(s) provided to isBetweenDates');
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

/**
 * Validates whether a given input is a valid date in supported formats.
 * Checks if a date is valid
 * @param date - The date to check
 * @returns True if the date is valid
 */
export function isValidDate(date: any): boolean {
    const parsedDate = parseDate(date, { throwError: false });
    return parsedDate !== null;
}

/**
 * Gets the start of a time unit (e.g., start of day, start of month)
 * @param date - The reference date
 * @param unit - The time unit
 * @returns A new Date representing the start of the specified unit
 */
export function startOf(
    date: Date | string | number,
    unit: Exclude<TimeUnit, 'millisecond' | 'second' | 'minute'>
): Date {
    const safeDate = parseDate(date, { throwError: true });
    if (!safeDate) {
        throw new ChronoUtilzError('Invalid date provided to startOf');
    }

    const result = new Date(safeDate.getTime());

    switch (unit) {
        case 'hour':
            result.setMinutes(0, 0, 0);
            break;
        case 'day':
            result.setHours(0, 0, 0, 0);
            break;
        case 'week': {
            // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
            const dayOfWeek = result.getDay();
            // Subtract days to get to Sunday (start of week)
            result.setDate(result.getDate() - dayOfWeek);
            result.setHours(0, 0, 0, 0);
            break;
        }
        case 'month':
            result.setDate(1);
            result.setHours(0, 0, 0, 0);
            break;
        case 'year':
            result.setMonth(0, 1);
            result.setHours(0, 0, 0, 0);
            break;
        default:
            throw new ChronoUtilzError(`Invalid time unit for startOf: ${unit}`);
    }

    return result;
}

/**
 * Gets the end of a time unit (e.g., end of day, end of month)
 * @param date - The reference date
 * @param unit - The time unit
 * @returns A new Date representing the end of the specified unit
 */
export function endOf(
    date: Date | string | number,
    unit: Exclude<TimeUnit, 'millisecond' | 'second' | 'minute'>
): Date {
    const safeDate = parseDate(date, { throwError: true });
    if (!safeDate) {
        throw new ChronoUtilzError('Invalid date provided to endOf');
    }

    const result = new Date(safeDate.getTime());

    switch (unit) {
        case 'hour':
            result.setMinutes(59, 59, 999);
            break;
        case 'day':
            result.setHours(23, 59, 59, 999);
            break;
        case 'week': {
            // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
            const dayOfWeek = result.getDay();
            // Add days to get to Saturday (end of week)
            result.setDate(result.getDate() + (6 - dayOfWeek));
            result.setHours(23, 59, 59, 999);
            break;
        }
        case 'month': {
            // Go to the first day of the next month, then subtract 1 millisecond
            result.setMonth(result.getMonth() + 1, 0);
            result.setHours(23, 59, 59, 999);
            break;
        }
        case 'year':
            result.setMonth(11, 31);
            result.setHours(23, 59, 59, 999);
            break;
        default:
            throw new ChronoUtilzError(`Invalid time unit for endOf: ${unit}`);
    }

    return result;
}

/**
 * Gets the day of the year (1-366)
 * @param date - The date
 * @returns The day of the year
 */
export function getDayOfYear(date: Date | string | number): number {
    const safeDate = parseDate(date, { throwError: true });
    if (!safeDate) {
        throw new ChronoUtilzError('Invalid date provided to getDayOfYear');
    }

    const startOfYear = new Date(safeDate.getFullYear(), 0, 0);
    const diff = safeDate.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

/**
 * Gets the week of the year (1-53)
 * @param date - The date
 * @returns The week of the year
 */
export function getWeekOfYear(date: Date | string | number): number {
    const safeDate = parseDate(date, { throwError: true });
    if (!safeDate) {
        throw new ChronoUtilzError('Invalid date provided to getWeekOfYear');
    }

    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    const target = new Date(safeDate.valueOf());
    const dayNr = (safeDate.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);

    // Get first day of year
    const firstThursday = new Date(target.getFullYear(), 0, 1);
    // First Thursday of the year
    if (firstThursday.getDay() !== 4) {
        firstThursday.setMonth(0, 1 + ((4 - firstThursday.getDay()) + 7) % 7);
    }

    // Get the week number: 1 + number of weeks
    const weekDiff = (target.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000);
    return 1 + Math.floor(weekDiff);
}

/**
 * Checks if a year is a leap year
 * @param year - The year to check or a date
 * @returns True if the year is a leap year
 */
export function isLeapYear(year: number | Date | string): boolean {
    let yearToCheck: number;

    if (typeof year === 'number') {
        yearToCheck = year;
    } else {
        const safeDate = parseDate(year, { throwError: true });
        if (!safeDate) {
            throw new ChronoUtilzError('Invalid date provided to isLeapYear');
        }
        yearToCheck = safeDate.getFullYear();
    }

    return (yearToCheck % 4 === 0 && yearToCheck % 100 !== 0) || (yearToCheck % 400 === 0);
}

/**
 * Gets the number of days in a month
 * @param date - The reference date
 * @returns The number of days in the month
 */
export function getDaysInMonth(date: Date | string | number): number {
    const safeDate = parseDate(date, { throwError: true });
    if (!safeDate) {
        throw new ChronoUtilzError('Invalid date provided to getDaysInMonth');
    }

    return new Date(safeDate.getFullYear(), safeDate.getMonth() + 1, 0).getDate();
}

/**
 * Returns a relative time string (e.g., "5 minutes ago", "in 2 days")
 * @param date - The date to get relative time for
 * @param baseDate - The base date (defaults to now)
 * @returns A human-readable relative time string
 */
export function getRelativeTime(
    date: Date | string | number,
    baseDate: Date | string | number = new Date()
): string {
    const safeDate = parseDate(date, { throwError: true });
    const safeBaseDate = parseDate(baseDate, { throwError: true });

    if (!safeDate || !safeBaseDate) {
        throw new ChronoUtilzError('Invalid date(s) provided to getRelativeTime');
    }

    const deltaMs = safeDate.getTime() - safeBaseDate.getTime();
    const isPast = deltaMs < 0;
    const absDelta = Math.abs(deltaMs);
    const deltaSeconds = Math.round(absDelta / 1000);

    // Helper for string formatting
    const format = (value: number, unit: string): string => {
        const plural = value !== 1 ? 's' : '';
        return isPast ? `${value} ${unit}${plural} ago` : `in ${value} ${unit}${plural}`;
    };

    // Tiny ranges
    if (deltaSeconds < 5) return 'just now';
    if (deltaSeconds < 60) return format(deltaSeconds, 'second');
    if (deltaSeconds < 3600) return format(Math.floor(deltaSeconds / 60), 'minute');
    if (deltaSeconds < 86400) return format(Math.floor(deltaSeconds / 3600), 'hour');
    if (deltaSeconds < 604800) return format(Math.floor(deltaSeconds / 86400), 'day');
    if (deltaSeconds < 2629800) return format(Math.floor(deltaSeconds / 604800), 'week');

    // Months and years: use calendar-aware difference
    const from = new Date(safeBaseDate.getFullYear(), safeBaseDate.getMonth(), safeBaseDate.getDate());
    const to = new Date(safeDate.getFullYear(), safeDate.getMonth(), safeDate.getDate());

    const years = to.getFullYear() - from.getFullYear();
    const months = to.getMonth() - from.getMonth();
    let totalMonths = years * 12 + months;

    // Adjust if the day of the month isn't reached yet
    if (to.getDate() < from.getDate()) {
        totalMonths -= 1;
    }

    if (Math.abs(totalMonths) >= 12) {
        return format(Math.floor(Math.abs(totalMonths) / 12), 'year');
    }

    return format(Math.abs(totalMonths), 'month');
}

/**
 * Gets the timezone offset in minutes
 * @param date - The date to get timezone offset for
 * @returns Timezone offset in minutes
 */
export function getTimezoneOffset(date: Date | string | number = new Date()): number {
    const safeDate = parseDate(date, { throwError: true });
    if (!safeDate) {
        throw new ChronoUtilzError('Invalid date provided to getTimezoneOffset');
    }

    return safeDate.getTimezoneOffset();
}

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
export function createDate(
    year: number,
    month: number,
    day: number,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0
): Date {
    // Validate inputs
    if (month < 0 || month > 11) {
        throw new ChronoUtilzError(`Month must be between 0 and 11, got ${month}`);
    }

    const date = new Date(year, month, day, hours, minutes, seconds, milliseconds);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        throw new ChronoUtilzError('Invalid date components provided to createDate');
    }

    // Verify that the day didn't roll over (e.g., April 31 -> May 1)
    if (date.getMonth() !== month) {
        throw new ChronoUtilzError(`Invalid day ${day} for month ${month}`);
    }

    return date;
}

/**
 * A calendar date without time information
 */
export class CalendarDate {
    private _year: number;
    private _month: number;
    private _day: number;

    /**
     * Creates a new CalendarDate
     * @param year - The year
     * @param month - The month (1-12)
     * @param day - The day (1-31)
     */
    constructor(year: number, month: number, day: number) {
        // Convert month from 1-based to 0-based for internal storage
        const internalMonth = month - 1;

        // Validate inputs through createDate (will throw if invalid)
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
    static fromDate(date: Date): CalendarDate {
        return new CalendarDate(
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
    static fromString(input: string | number): CalendarDate {
        const date = parseDate(input, { throwError: true });
        if (!date) {
            throw new ChronoUtilzError('Invalid date provided to CalendarDate.fromString');
        }
        return CalendarDate.fromDate(date);
    }

    /**
     * Gets the year
     */
    get year(): number {
        return this._year;
    }

    /**
     * Gets the month (1-12)
     */
    get month(): number {
        return this._month + 1;
    }

    /**
     * Gets the day (1-31)
     */
    get day(): number {
        return this._day;
    }

    /**
     * Converts to a JavaScript Date object (at midnight local time)
     * @returns A new Date object
     */
    toDate(): Date {
        return new Date(this._year, this._month, this._day, 0, 0, 0, 0);
    }

    /**
     * Returns an ISO date string (YYYY-MM-DD)
     * @returns ISO date string
     */
    toString(): string {
        return formatDate(this.toDate(), 'YYYY-MM-DD');
    }

    /**
     * Adds time to this calendar date
     * @param amount - The amount to add
     * @param unit - The time unit (limited to day, week, month, year)
     * @returns A new CalendarDate
     */
    add(
        amount: number,
        unit: Extract<TimeUnit, 'day' | 'week' | 'month' | 'year'>
    ): CalendarDate {
        const newDate = addTime(this.toDate(), amount, unit);
        return CalendarDate.fromDate(newDate);
    }

    /**
     * Checks if this calendar date is equal to another
     * @param other - The other calendar date
     * @returns True if the dates are equal
     */
    equals(other: CalendarDate): boolean {
        return (
            this._year === other._year &&
            this._month === other._month &&
            this._day === other._day
        );
    }

    /**
     * Compares this calendar date with another
     * @param other - The other calendar date
     * @returns Negative if this < other, 0 if equal, positive if this > other
     */
    compare(other: CalendarDate): number {
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
    isBefore(other: CalendarDate): boolean {
        return this.compare(other) < 0;
    }

    /**
     * Checks if this calendar date is after another
     * @param other - The other calendar date
     * @returns True if this date is after the other
     */
    isAfter(other: CalendarDate): boolean {
        return this.compare(other) > 0;
    }
}

/**
 * Gets the current UTC date and time
 * @returns The current UTC date and time
 */
export function utcNow(): Date {
    const now = new Date();
    return new Date(now.getTime() + now.getTimezoneOffset() * 60000);
}

/**
 * Converts a date to UTC
 * @param date - The date to convert
 * @returns A new Date in UTC
 */
export function toUTC(date: Date | string | number): Date {
    const safeDate = parseDate(date, { throwError: true });
    if (!safeDate) {
        throw new ChronoUtilzError('Invalid date provided to toUTC');
    }

    return new Date(
        safeDate.getTime() + safeDate.getTimezoneOffset() * 60000
    );
}

/**
 * Gets a string representation of the current timezone
 * @returns Timezone string (e.g., "UTC+2")
 */
export function getTimezoneString(): string {
    const offset = new Date().getTimezoneOffset();
    const sign = offset <= 0 ? '+' : '-';
    const absOffset = Math.abs(offset);
    const hours = Math.floor(absOffset / 60);
    const minutes = absOffset % 60;

    return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Validates if a date string matches a specific format
 * @param dateStr - The date string to validate
 * @param format - The expected format
 * @returns True if the date string matches the format and is valid
 */
export function validateDateFormat(dateStr: string, format: DateFormat): boolean {

    let match: RegExpMatchArray | null;

    switch (format) {
        case 'YYYY-MM-DD':
            match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (!match) return false;
            break;
        case 'MM/DD/YYYY':{
            match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
            if (!match) return false;
            const [ , mm1, dd1, yyyy1 ] = match.map(Number);
            if (mm1 < 1 || mm1 > 12 || dd1 < 1 || dd1 > 31) return false;
            return new Date(`${yyyy1}-${String(mm1).padStart(2, '0')}-${String(dd1).padStart(2, '0')}`).getMonth() === mm1 - 1;
        }
        case 'DD/MM/YYYY': {
            match = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
            if (!match) return false;
            const [, dd2, mm2, yyyy2] = match.map(Number);
            if (mm2 < 1 || mm2 > 12 || dd2 < 1 || dd2 > 31) return false;
            return new Date(`${yyyy2}-${String(mm2).padStart(2, '0')}-${String(dd2).padStart(2, '0')}`).getDate() === dd2;
        }
        case 'YYYY-MM-DD HH:mm:ss':
            match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/);
            if (!match) return false;
            break;
        case 'DD MMM YYYY':
            match = dateStr.match(/^(\d{1,2}) ([A-Za-z]{3}) (\d{4})$/);
            if (!match) return false;
            break;
        case 'MMM DD, YYYY':
            match = dateStr.match(/^([A-Za-z]{3}) (\d{1,2}), (\d{4})$/);
            if (!match) return false;
            break;
        case 'HH:mm:ss': {
            match = dateStr.match(/^(\d{2}):(\d{2}):(\d{2})$/);
            if (!match) return false;
            const [, h1, m1, s1] = match.map(Number);
            return h1 < 24 && m1 < 60 && s1 < 60;
        }
        case 'hh:mm A': {
            match = dateStr.match(/^(\d{1,2}):(\d{2}) ([AP]M)$/);
            if (!match) return false;
            const hour = parseInt(match[1], 10);
            const minute = parseInt(match[2], 10);
            return hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59;
        }
        default:
            return false;
    }

    // Optional: Try parsing to be doubly sure
    try {
        const date = parseDate(dateStr);
        return date !== null && !isNaN(date.getTime());
    } catch {
        return false;
    }
}

/**
 * Options for date range generation
 */
export interface DateRangeOptions {
    /** The start date of the range */
    start: Date | string;
    /** The end date of the range */
    end: Date | string;
    /** The increment unit (default: 'day') */
    unit?: TimeUnit;
    /** The increment value (default: 1) */
    step?: number;
    /** Whether to include the end date (default: true) */
    inclusive?: boolean;
}

/**
 * Generates an array of dates between a start and end date
 *
 * @example
 * ```
 * // Generate dates for each day in May 2025
 * const datesInMay = ChronoUtilzHelper.generateDateRange({
 *   start: '2025-05-01',
 *   end: '2025-05-31'
 * });
 * ```
 *
 * @param options - Configuration options for the date range
 * @returns An array of Date objects
 */
export function generateDateRange(options: DateRangeOptions): Date[] {
    const {
        start,
        end,
        unit = 'day',
        step = 1,
        inclusive = true
    } = options;

    const startDate = ChronoUtilz.parseDate(start);
    const endDate = ChronoUtilz.parseDate(end);

    if (!startDate || !endDate) {
        throw new Error('Invalid start or end date provided');
    }

    if (startDate > endDate) {
        throw new Error('Start date must be before or equal to end date');
    }

    const dates: Date[] = [];
    let currentDate = new Date(startDate);

    while (
        currentDate < endDate ||
        (inclusive && currentDate.getTime() === endDate.getTime())
        ) {
        dates.push(new Date(currentDate));
        currentDate = ChronoUtilz.addTime(currentDate, step, unit);
    }

    return dates;
}

/**
 * Gets a human-readable duration string from milliseconds
 *
 * @example
 * ```
 * // "2 days, 4 hours, 30 minutes"
 * const duration = ChronoUtilzHelper.formatDuration(189000000);
 * ```
 *
 * @param milliseconds - The duration in milliseconds
 * @param options - Formatting options
 * @returns A formatted duration string
 */
export function formatDuration(
    milliseconds: number,
    options: { longFormat?: boolean, maxUnits?: number } = {}
): string {
    const { longFormat = true, maxUnits = 3 } = options;

    if (milliseconds === 0) {
        return longFormat ? '0 milliseconds' : '0ms';
    }

    const units: [string, string, number][] = [
        ['year', 'y', 31536000000],
        ['month', 'mo', 2592000000],
        ['day', 'd', 86400000],
        ['hour', 'h', 3600000],
        ['minute', 'm', 60000],
        ['second', 's', 1000],
        ['millisecond', 'ms', 1]
    ];

    const parts: string[] = [];
    let remaining = Math.abs(milliseconds);

    for (const [longName, shortName, value] of units) {
        if (parts.length >= maxUnits) break;

        const count = Math.floor(remaining / value);
        remaining %= value;

        if (count === 0) continue;

        if (longFormat) {
            parts.push(`${count} ${longName}${count !== 1 ? 's' : ''}`);
        } else {
            parts.push(`${count}${shortName}`);
        }
    }

    return parts.join(longFormat ? ', ' : ' ');
}

/**
 * Returns the quarter number (1-4) for a given date
 *
 * @example
 * ```
 * const quarter = ChronoUtilzHelper.getQuarter(new Date(2025, 4, 15)); // 2 (Q2)
 * ```
 *
 * @param date - The date to get the quarter for
 * @returns The quarter number (1-4)
 */
export function getQuarter(date: Date | string): number {
    const parsedDate = ChronoUtilz.parseDate(date);
    if (!parsedDate) {
        throw new Error('Invalid date provided');
    }

    const month = parsedDate.getMonth();
    return Math.floor(month / 3) + 1;
}

/**
 * Returns the first or last date of a quarter
 *
 * @example
 * ```
 * // Get the first day of the current quarter
 * const startOfQuarter = ChronoUtilzHelper.getQuarterDate(new Date(), 'start');
 *
 * // Get the last day of Q3 2025
 * const endOfQ3 = ChronoUtilzHelper.getQuarterDate(new Date(2025, 8, 15), 'end');
 * ```
 *
 * @param date - The reference date
 * @param type - Either 'start' or 'end' of the quarter
 * @returns Date object representing the start or end of the quarter
 */
export function getQuarterDate(
    date: Date | string,
    type: 'start' | 'end'
): Date {
    const parsedDate = ChronoUtilz.parseDate(date);
    if (!parsedDate) {
        throw new Error('Invalid date provided');
    }

    const quarter = getQuarter(parsedDate);
    const year = parsedDate.getFullYear();

    if (type === 'start') {
        // First day of the quarter (months are 0-indexed)
        return new Date(year, (quarter - 1) * 3, 1);
    } else {
        // Last day of the quarter
        return new Date(year, quarter * 3, 0);
    }
}


/**
 * Calculates business days between two dates (excluding weekends and optionally holidays)
 *
 * @example
 * ```
 * // Calculate business days between two dates
 * const workDays = ChronoUtilzHelper.getBusinessDays(
 *   '2025-05-01',
 *   '2025-05-15',
 *   ['2025-05-05'] // Optional holidays to exclude
 * );
 * ```
 *
 * @param startDate - Start date
 * @param endDate - End date
 * @param holidays - Optional array of holiday dates to exclude
 * @returns Number of business days between dates
 */
export function getBusinessDays(
    startDate: Date | string,
    endDate: Date | string,
    holidays: (Date | string)[] = []
): number {
    const start = ChronoUtilz.parseDate(startDate);
    const end = ChronoUtilz.parseDate(endDate);

    if (!start || !end) {
        throw new Error('Invalid start or end date');
    }

    // Convert holidays to timestamp set for O(1) lookup
    const holidaySet = new Set(
        holidays
            .map(h => {
                const date = ChronoUtilz.parseDate(h);
                return date ? ChronoUtilz.formatDate(date, 'YYYY-MM-DD') : null;
            })
            .filter((date): date is string => date !== null)
    );

    let count = 0;
    const dayMilliseconds = 24 * 60 * 60 * 1000;

    // Loop through each day
    for (
        let current = ChronoUtilz.startOf(start, 'day');
        current <= end;
        current = new Date(current.getTime() + dayMilliseconds)
    ) {
        // Skip weekends (0 = Sunday, 6 = Saturday)
        const day = current.getDay();
        if (day === 0 || day === 6) {
            continue;
        }

        // Skip holidays
        const dateStr = ChronoUtilz.formatDate(current, 'YYYY-MM-DD');
        if (holidaySet.has(dateStr)) {
            continue;
        }

        count++;
    }

    return count;
}

/**
 * Age calculator that handles leap years and different formats
 *
 * @example
 * ```
 * // Calculate age in years
 * const age = ChronoUtilzHelper.calculateAge('1990-05-15');  // 35 (in 2025)
 *
 * // Calculate age in multiple units
 * const detailedAge = ChronoUtilzHelper.calculateAge('1990-05-15', {
 *   units: ['year', 'month', 'day']
 * });  // { years: 35, months: 0, days: 23 } (if today is May 7, 2025)
 * ```
 *
 * @param birthDate - The birth date
 * @param options - Calculation options
 * @returns Age in years or detailed object with multiple units
 */
export function calculateAge(
    birthDate: Date | string,
    options: {
        referenceDate?: Date | string;
        units?: ('year' | 'month' | 'day')[];
    } = {}
): number | { years: number; months: number; days: number } {
    const birth = ChronoUtilz.parseDate(birthDate);
    if (!birth) {
        throw new Error('Invalid birth date');
    }

    const reference = options.referenceDate
        ? ChronoUtilz.parseDate(options.referenceDate)
        : new Date();

    if (!reference) {
        throw new Error('Invalid reference date');
    }

    if (birth > reference) {
        throw new Error('Birth date cannot be in the future');
    }

    // Simple case: just years
    if (!options.units || options.units.length === 0 ||
        (options.units.length === 1 && options.units[0] === 'year')) {
        let age = reference.getFullYear() - birth.getFullYear();

        // Adjust if birthday hasn't occurred yet this year
        if (
            reference.getMonth() < birth.getMonth() ||
            (reference.getMonth() === birth.getMonth() &&
                reference.getDate() < birth.getDate())
        ) {
            age--;
        }

        return age;
    }

    // Detailed calculation with years, months, days
    let years = reference.getFullYear() - birth.getFullYear();
    let months = reference.getMonth() - birth.getMonth();
    let days = reference.getDate() - birth.getDate();

    // Adjust days
    if (days < 0) {
        months--;
        // Days in the previous month
        const prevMonth = new Date(reference.getFullYear(), reference.getMonth(), 0);
        days += prevMonth.getDate();
    }

    // Adjust months
    if (months < 0) {
        years--;
        months += 12;
    }

    return { years, months, days };
}

/**
 * ChronoUtilz namespace - contains all ChronoUtilz exports for easy access
 */
export const ChronoUtilz = {
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

export default ChronoUtilz;