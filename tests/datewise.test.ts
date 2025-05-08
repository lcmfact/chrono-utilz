
import { expect } from 'chai';
import * as sinon from 'sinon';
import {
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
    validateDateFormat, ChronoUtilzError, ChronoUtilz
} from '../src';

describe('ChronoUtilz', () => {
    let clock: sinon.SinonFakeTimers;

    beforeEach(() => {
        clock = sinon.useFakeTimers({
            now: new Date('2025-05-07T12:30:45.678Z'),
            toFake: ['Date']
        });
    });

    afterEach(() => {
        clock.restore();
    });

    describe('getTimezoneOffset', () => {
        it('should return a number for a valid Date object', () => {
            const offset = getTimezoneOffset(new Date('2025-05-07'));
            expect(offset).to.be.a('number');
        });

        it('should return correct offset compared to native Date object', () => {
            const expected = new Date('2025-05-07T00:00:00Z').getTimezoneOffset();
            const actual = getTimezoneOffset('2025-05-07T00:00:00Z');
            expect(actual).to.equal(expected);
        });

        it('should throw an error for invalid date string', () => {
            expect(() => getTimezoneOffset('invalid-date')).to.throw(ChronoUtilzError, 'ChronoUtilz Error: Unable to parse date: invalid-date');
        });
    });

    describe('parseDate', () => {
        it('should parse ISO date strings', () => {
            const result = parseDate('2025-05-07T12:30:45.678Z');
            expect(result).to.be.instanceOf(Date);
            expect(result?.getFullYear()).to.equal(2025);
            expect(result?.getMonth()).to.equal(4); // May is month 4 (0-indexed)
            expect(result?.getDate()).to.equal(7);
        });

        it('should parse Date objects', () => {
            const original = new Date('2025-05-07');
            const result = parseDate(original);
            expect(result).to.be.instanceOf(Date);
            expect(result?.getTime()).to.equal(original.getTime());
            // Should be a new instance, not the same reference
            expect(result).to.not.equal(original);
        });

        it('should parse timestamps', () => {
            const timestamp = new Date('2025-05-07').getTime();
            const result = parseDate(timestamp);
            expect(result).to.be.instanceOf(Date);
            expect(result?.getTime()).to.equal(timestamp);
        });

        it('should parse MM/DD/YYYY format', () => {
            const result = parseDate('05/07/2025');
            expect(result).to.be.instanceOf(Date);
            expect(result?.getFullYear()).to.equal(2025);
            expect(result?.getMonth()).to.equal(4);
            expect(result?.getDate()).to.equal(7);
        });

        it('should return null for invalid dates when throwError is false', () => {
            const result = parseDate('not-a-date', { throwError: false });
            expect(result).to.be.null;
        });

        it('should throw for invalid dates when throwError is true', () => {
            expect(() => parseDate('not-a-date', { throwError: true })).to.throw();
        });

        it('should return fallback for invalid dates', () => {
            const fallback = new Date('2020-01-01');
            const result = parseDate('not-a-date', { fallback });
            expect(result).to.equal(fallback);
        });
    });

    describe('formatDate', () => {
        it('should format dates as YYYY-MM-DD by default', () => {
            const date = new Date('2025-05-07');
            expect(formatDate(date)).to.equal('2025-05-07');
        });

        it('should format dates as MM/DD/YYYY', () => {
            const date = new Date('2025-05-07');
            expect(formatDate(date, 'MM/DD/YYYY')).to.equal('05/07/2025');
        });

        it('should format dates as DD/MM/YYYY', () => {
            const date = new Date('2025-05-07');
            expect(formatDate(date, 'DD/MM/YYYY')).to.equal('07/05/2025');
        });

        it('should format dates with time', () => {
            const date = new Date('2025-05-07T14:30:00');
            expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).to.equal('2025-05-07 14:30:00');
        });

        it('should format dates with month names', () => {
            const date = new Date('2025-05-07');
            expect(formatDate(date, 'DD MMM YYYY')).to.equal('07 May 2025');
            expect(formatDate(date, 'MMM DD, YYYY')).to.equal('May 07, 2025');
        });

        it('should format time only', () => {
            const date = new Date('2025-05-07T14:30:45');
            expect(formatDate(date, 'HH:mm:ss')).to.equal('14:30:45');
            expect(formatDate(date, 'hh:mm A')).to.equal('02:30 PM');
        });

        it('should throw for unsupported formats', () => {
            const date = new Date('2025-05-07');
            // @ts-ignore
            // - Testing runtime behavior with invalid input
            expect(() => formatDate(date, 'INVALID')).to.throw();
        });
    });

    describe('addTime', () => {
        it('should add days', () => {
            const date = new Date('2025-05-07');
            const result = addTime(date, 5, 'day');
            expect(formatDate(result)).to.equal('2025-05-12');
        });

        it('should add months', () => {
            const date = new Date('2025-05-07');
            const result = addTime(date, 3, 'month');
            expect(formatDate(result)).to.equal('2025-08-07');
        });

        it('should handle month overflow', () => {
            const date = new Date('2025-12-07');
            const result = addTime(date, 2, 'month');
            expect(formatDate(result)).to.equal('2026-02-07');
        });

        it('should add years', () => {
            const date = new Date('2025-05-07');
            const result = addTime(date, 5, 'year');
            expect(formatDate(result)).to.equal('2030-05-07');
        });

        it('should add hours, minutes, seconds', () => {
            const date = new Date('2025-05-07T12:00:00');
            let result = addTime(date, 3, 'hour');
            expect(result.getHours()).to.equal(15);

            result = addTime(date, 30, 'minute');
            expect(result.getMinutes()).to.equal(30);

            result = addTime(date, 45, 'second');
            expect(result.getSeconds()).to.equal(45);
        });
    });

    describe('subtractTime', () => {
        it('should subtract days', () => {
            const date = new Date('2025-05-07');
            const result = subtractTime(date, 5, 'day');
            expect(formatDate(result)).to.equal('2025-05-02');
        });

        it('should subtract months', () => {
            const date = new Date('2025-05-07');
            const result = subtractTime(date, 3, 'month');
            expect(formatDate(result)).to.equal('2025-02-07');
        });
    });

    describe('getDateDiff', () => {
        it('should calculate difference in days', () => {
            const date1 = new Date('2025-05-10');
            const date2 = new Date('2025-05-05');
            expect(getDateDiff(date1, date2, 'day')).to.equal(5);
        });

        it('should calculate difference in months', () => {
            const date1 = new Date('2025-08-07');
            const date2 = new Date('2025-05-07');
            expect(getDateDiff(date1, date2, 'month')).to.equal(3);
        });

        it('should handle negative differences', () => {
            const date1 = new Date('2025-05-05');
            const date2 = new Date('2025-05-10');
            expect(getDateDiff(date1, date2, 'day')).to.equal(-5);
        });
    });

    describe('isBetweenDates', () => {
        it('should return true when date is between start and end (inclusive)', () => {
            const date = new Date('2025-05-07');
            const start = new Date('2025-05-05');
            const end = new Date('2025-05-10');
            expect(isBetweenDates(date, start, end)).to.be.true;
        });

        it('should consider boundary dates when inclusive is true', () => {
            const start = new Date('2025-05-05');
            const end = new Date('2025-05-10');
            expect(isBetweenDates(start, start, end)).to.be.true;
            expect(isBetweenDates(end, start, end)).to.be.true;
        });

        it('should not consider boundary dates when inclusive is false', () => {
            const start = new Date('2025-05-05');
            const end = new Date('2025-05-10');
            expect(isBetweenDates(start, start, end, false)).to.be.false;
            expect(isBetweenDates(end, start, end, false)).to.be.false;
        });

        it('should return false when date is outside range', () => {
            const date = new Date('2025-05-12');
            const start = new Date('2025-05-05');
            const end = new Date('2025-05-10');
            expect(isBetweenDates(date, start, end)).to.be.false;
        });
    });

    describe('isValidDate', () => {
        it('should return true for valid dates', () => {
            expect(isValidDate(new Date())).to.be.true;
            expect(isValidDate('2025-05-07')).to.be.true;
            expect(isValidDate('05/07/2025')).to.be.true;
        });

        // it('should return false for invalid dates', () => {
        //     expect(isValidDate('not-a-date')).to.be.false;
        //     expect(isValidDate(new Date('invalid'))).to.be.false;
        //     expect(isValidDate('02/30/2025')).to.be.false;
        // });
    });

    describe('startOf', () => {
        it('should get start of day', () => {
            const date = new Date('2025-05-07T14:30:45.678');
            const result = startOf(date, 'day');
            expect(result.getHours()).to.equal(0);
            expect(result.getMinutes()).to.equal(0);
            expect(result.getSeconds()).to.equal(0);
            expect(result.getMilliseconds()).to.equal(0);
            expect(formatDate(result)).to.equal('2025-05-07');
        });

        it('should get start of month', () => {
            const date = new Date('2025-05-07');
            const result = startOf(date, 'month');
            expect(formatDate(result)).to.equal('2025-05-01');
            expect(result.getHours()).to.equal(0);
        });

        it('should get start of year', () => {
            const date = new Date('2025-05-07');
            const result = startOf(date, 'year');
            expect(formatDate(result)).to.equal('2025-01-01');
            expect(result.getHours()).to.equal(0);
        });
    });

    describe('endOf', () => {
        it('should get end of day', () => {
            const date = new Date('2025-05-07T14:30:45.678');
            const result = endOf(date, 'day');
            expect(result.getHours()).to.equal(23);
            expect(result.getMinutes()).to.equal(59);
            expect(result.getSeconds()).to.equal(59);
            expect(result.getMilliseconds()).to.equal(999);
            expect(formatDate(result, 'YYYY-MM-DD')).to.equal('2025-05-07');
        });

        it('should get end of month', () => {
            const date = new Date('2025-05-07');
            const result = endOf(date, 'month');
            expect(formatDate(result, 'YYYY-MM-DD')).to.equal('2025-05-31');
            expect(result.getHours()).to.equal(23);
            expect(result.getMinutes()).to.equal(59);
        });

        it('should get end of year', () => {
            const date = new Date('2025-05-07');
            const result = endOf(date, 'year');
            expect(formatDate(result, 'YYYY-MM-DD')).to.equal('2025-12-31');
            expect(result.getHours()).to.equal(23);
            expect(result.getMinutes()).to.equal(59);
        });
    });

    describe('getDayOfYear', () => {
        it('should calculate day of year', () => {
            // May 7th is the 127th day of a non-leap year
            const date = new Date('2025-05-07');
            expect(getDayOfYear(date)).to.equal(127);
        });

        it('should handle leap years', () => {
            // May 7th is the 128th day of a leap year
            const date = new Date('2024-05-07');
            expect(getDayOfYear(date)).to.equal(128);
        });
    });

    describe('getWeekOfYear', () => {
        it('should calculate week of year', () => {
            const date = new Date('2025-05-07');
            // The exact week number depends on the specific date and how weeks are calculated
            expect(getWeekOfYear(date)).to.be.a('number');
            expect(getWeekOfYear(date)).to.be.greaterThan(0);
            expect(getWeekOfYear(date)).to.be.lessThan(54); // Maximum possible week number
        });
    });

    describe('isLeapYear', () => {
        it('should identify leap years', () => {
            expect(isLeapYear(2024)).to.be.true;
            expect(isLeapYear(2028)).to.be.true;
            expect(isLeapYear(2000)).to.be.true;
        });

        it('should identify non-leap years', () => {
            expect(isLeapYear(2025)).to.be.false;
            expect(isLeapYear(2100)).to.be.false;
            expect(isLeapYear(2023)).to.be.false;
        });

        it('should work with date objects', () => {
            expect(isLeapYear(new Date('2024-01-01'))).to.be.true;
            expect(isLeapYear(new Date('2025-01-01'))).to.be.false;
        });
    });

    describe('toUTC', () => {
        it('should convert a local Date to UTC equivalent', () => {
            const localDate = new Date(2025, 4, 7, 12, 0, 0); // May 7, 2025, 12:00 local time
            const result = toUTC(localDate);

            const expectedUtc = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
            expect(result.getTime()).to.equal(expectedUtc.getTime());
        });

        it('should accept string date inputs', () => {
            const localString = '2025-05-07T12:00:00';
            const result = toUTC(localString);

            const localDate = new Date(localString);
            const expectedUtc = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
            expect(result.getTime()).to.equal(expectedUtc.getTime());
        });

        it('should throw if invalid date is provided', () => {
            expect(() => toUTC('not-a-date')).to.throw(ChronoUtilzError, "ChronoUtilz Error: Unable to parse date: not-a-date");
        });
    });

    describe('getTimezoneString', () => {
        it('should return a string starting with "UTC"', () => {
            const result = getTimezoneString();
            expect(result.startsWith('UTC')).to.be.true;
        });

        it('should return a valid timezone format', () => {
            const result = getTimezoneString();
            const pattern = /^UTC[+-]\d{2}:\d{2}$/;
            expect(result).to.match(pattern);
        });

        it('should reflect correct offset from Date object', () => {
            const offset = new Date().getTimezoneOffset();
            const sign = offset <= 0 ? '+' : '-';
            const absOffset = Math.abs(offset);
            const hours = Math.floor(absOffset / 60)
                .toString()
                .padStart(2, '0');
            const minutes = (absOffset % 60).toString().padStart(2, '0');

            const expected = `UTC${sign}${hours}:${minutes}`;
            const result = getTimezoneString();

            expect(result).to.equal(expected);
        });
    });

    describe('utcNow', () => {
        it('should return a Date object', () => {
            const result = utcNow();
            expect(result).to.be.an.instanceOf(Date);
        });

        it('should be approximately equal to current UTC time', () => {
            const localNow = new Date();
            const expectedUtc = new Date(localNow.getTime() + localNow.getTimezoneOffset() * 60000);
            const result = utcNow();
            const diffInMs = Math.abs(result.getTime() - expectedUtc.getTime());

            // Allow slight delay between executions (e.g., 10ms)
            expect(diffInMs).to.be.lessThan(20);
        });
    });

    describe('createDate', () => {
        it('should create a valid date for year, month, and day', () => {
            const date = createDate(2025, 4, 7); // May 7, 2025
            expect(date.getFullYear()).to.equal(2025);
            expect(date.getMonth()).to.equal(4); // May
            expect(date.getDate()).to.equal(7);
        });

        it('should default time components to zero if not provided', () => {
            const date = createDate(2025, 4, 7);
            expect(date.getHours()).to.equal(0);
            expect(date.getMinutes()).to.equal(0);
            expect(date.getSeconds()).to.equal(0);
            expect(date.getMilliseconds()).to.equal(0);
        });

        it('should create a valid date with full time components', () => {
            const date = createDate(2025, 4, 7, 13, 45, 30, 500);
            expect(date.getHours()).to.equal(13);
            expect(date.getMinutes()).to.equal(45);
            expect(date.getSeconds()).to.equal(30);
            expect(date.getMilliseconds()).to.equal(500);
        });
        it('should throw if month is less than 0', () => {
            expect(() => createDate(2025, -1, 10)).to.throw(ChronoUtilzError, /Month must be between 0 and 11/);
        });

        it('should throw if month is greater than 11', () => {
            expect(() => createDate(2025, 12, 10)).to.throw(ChronoUtilzError, /Month must be between 0 and 11/);
        });

        it('should throw if date is invalid (e.g., April 31)', () => {
            expect(() => createDate(2025, 3, 31)).to.throw(ChronoUtilzError, /Invalid day 31 for month 3/);
        });

        it('should throw if components result in an invalid date (e.g., Feb 30)', () => {
            expect(() => createDate(2025, 1, 30)).to.throw(ChronoUtilzError, /Invalid day 30 for month 1/);
        });

        it('should allow Feb 29 on a leap year', () => {
            const date = createDate(2024, 1, 29);
            expect(date.getFullYear()).to.equal(2024);
            expect(date.getMonth()).to.equal(1); // February
            expect(date.getDate()).to.equal(29);
        });
    });

    describe('getDaysInMonth', () => {
        it('should get correct days for 30-day months', () => {
            expect(getDaysInMonth(new Date('2025-04-01'))).to.equal(30); // April
            expect(getDaysInMonth(new Date('2025-06-01'))).to.equal(30); // June
            expect(getDaysInMonth(new Date('2025-09-01'))).to.equal(30); // September
            expect(getDaysInMonth(new Date('2025-11-01'))).to.equal(30); // November
        });

        it('should get correct days for 31-day months', () => {
            expect(getDaysInMonth(new Date('2025-01-01'))).to.equal(31); // January
            expect(getDaysInMonth(new Date('2025-03-01'))).to.equal(31); // March
            expect(getDaysInMonth(new Date('2025-05-01'))).to.equal(31); // May
            expect(getDaysInMonth(new Date('2025-07-01'))).to.equal(31); // July
            expect(getDaysInMonth(new Date('2025-08-01'))).to.equal(31); // August
            expect(getDaysInMonth(new Date('2025-10-01'))).to.equal(31); // October
            expect(getDaysInMonth(new Date('2025-12-01'))).to.equal(31); // December
        });

        it('should handle February in leap and non-leap years', () => {
            expect(getDaysInMonth(new Date('2024-02-01'))).to.equal(29); // Leap year
            expect(getDaysInMonth(new Date('2025-02-01'))).to.equal(28); // Non-leap year
        });
    });

    describe('getRelativeTime', () => {
        it('should format future times', () => {
            const now = new Date();
            const future = addTime(now, 5, 'minute');
            expect(getRelativeTime(future)).to.equal('in 5 minutes');
        });

        it('should format past times', () => {
            const now = new Date();
            const past = subtractTime(now, 3, 'hour');
            expect(getRelativeTime(past)).to.equal('3 hours ago');
        });

        it('should handle just now', () => {
            const now = new Date();
            expect(getRelativeTime(now)).to.equal('just now');
        });

        it('should handle longer time periods', () => {
            const now = new Date();
            const farFuture = addTime(now, 2, 'year');
            expect(getRelativeTime(farFuture)).to.equal('in 2 years');

            const farPast = subtractTime(now, 6, 'month');
            expect(getRelativeTime(farPast)).to.equal('6 months ago');
        });
    });

    describe('CalendarDate', () => {
        it('should create from year, month, day', () => {
            const calDate = new CalendarDate(2025, 5, 7);
            expect(calDate.year).to.equal(2025);
            expect(calDate.month).to.equal(5);
            expect(calDate.day).to.equal(7);
        });

        it('should convert to Date object', () => {
            const calDate = new CalendarDate(2025, 5, 7);
            const date = calDate.toDate();
            expect(date.getFullYear()).to.equal(2025);
            expect(date.getMonth()).to.equal(4); // 0-indexed in Date
            expect(date.getDate()).to.equal(7);
        });

        it('should create from Date object', () => {
            const date = new Date('2025-05-07');
            const calDate = CalendarDate.fromDate(date);
            expect(calDate.year).to.equal(2025);
            expect(calDate.month).to.equal(5);
            expect(calDate.day).to.equal(7);
        });

        it('should compare dates correctly', () => {
            const date1 = new CalendarDate(2025, 5, 7);
            const date2 = new CalendarDate(2025, 5, 10);
            const date3 = new CalendarDate(2025, 6, 1);

            expect(date1.isBefore(date2)).to.be.true;
            expect(date2.isAfter(date1)).to.be.true;
            expect(date1.isBefore(date3)).to.be.true;
            expect(date3.isAfter(date2)).to.be.true;
        });

        it('should add time', () => {
            const date = new CalendarDate(2025, 5, 7);
            const newDate = date.add(3, 'day');
            expect(newDate.day).to.equal(10);
            expect(newDate.month).to.equal(5);
            expect(newDate.year).to.equal(2025);

            const nextMonth = date.add(1, 'month');
            expect(nextMonth.month).to.equal(6);
        });

        it('should check equality', () => {
            const date1 = new CalendarDate(2025, 5, 7);
            const date2 = new CalendarDate(2025, 5, 7);
            const date3 = new CalendarDate(2025, 5, 8);

            expect(date1.equals(date2)).to.be.true;
            expect(date1.equals(date3)).to.be.false;
        });
    });

    describe('validateDateFormat', () => {
        it('should validate YYYY-MM-DD format', () => {
            expect(validateDateFormat('2025-05-07', 'YYYY-MM-DD')).to.be.true;
            expect(validateDateFormat('2025-13-07', 'YYYY-MM-DD')).to.be.false; // Invalid month
            expect(validateDateFormat('202-05-07', 'YYYY-MM-DD')).to.be.false; // Wrong format
        });

        it('should validate MM/DD/YYYY format', () => {
            expect(validateDateFormat('05/07/2025', 'MM/DD/YYYY')).to.be.true;
            expect(validateDateFormat('13/07/2025', 'MM/DD/YYYY')).to.be.false; // Invalid month
        });

        it('should validate time formats', () => {
            expect(validateDateFormat('14:30:00', 'HH:mm:ss')).to.be.true;
            expect(validateDateFormat('25:30:00', 'HH:mm:ss')).to.be.false; // Invalid hour
            expect(validateDateFormat('02:30 PM', 'hh:mm A')).to.be.true;
            expect(validateDateFormat('14:30 PM', 'hh:mm A')).to.be.false; // 14 is not valid in 12-hour format
        });
    });


    describe('generateDateRange', () => {
        it('should generate a daily inclusive date range', () => {
            const range = ChronoUtilz.generateDateRange({
                start: '2025-05-01',
                end: '2025-05-03',
                unit: 'day',
                step: 1,
            });

            expect(range).to.have.lengthOf(3);
            expect(range[0].toISOString()).to.include('2025-05-01');
            expect(range[2].toISOString()).to.include('2025-05-03');
        });

        it('should throw for invalid range', () => {
            expect(() =>
                ChronoUtilz.generateDateRange({
                    start: '2025-05-10',
                    end: '2025-05-01',
                })
            ).to.throw('Start date must be before or equal to end date');
        });
    });
    describe('formatDuration', () => {
        it('should format duration in long format by default', () => {
            const formatted = ChronoUtilz.formatDuration(90061000); // 1d 1h 1m 1s
            expect(formatted).to.include('day');
            expect(formatted).to.include('hour');
            expect(formatted).to.include('minute');
        });

        it('should format duration in short format', () => {
            const formatted = ChronoUtilz.formatDuration(90061000, {
                longFormat: false,
            });
            expect(formatted).to.match(/[0-9]+d.*[0-9]+h.*[0-9]+m/);
        });

        it('should handle 0 ms', () => {
            const formatted = ChronoUtilz.formatDuration(0);
            expect(formatted).to.equal('0 milliseconds');
        });
    });

    describe('getQuarter', () => {
        it('should return correct quarter', () => {
            const q = ChronoUtilz.getQuarter('2025-04-10');
            expect(q).to.equal(2);
        });

        it('should throw on invalid date', () => {
            expect(() => ChronoUtilz.getQuarter('not-a-date')).to.throw();
        });
    });


    describe('getBusinessDays', () => {
        it('should count weekdays excluding weekends and holidays', () => {
            const holidays = ['2025-05-05']; // Monday
            const count = ChronoUtilz.getBusinessDays('2025-05-01', '2025-05-07', holidays);
            expect(count).to.equal(4); // Excludes Sat, Sun, and holiday
        });
    });

    describe('calculateAge', () => {
        it('should return age in years', () => {
            const age = ChronoUtilz.calculateAge('2000-05-01', {
                referenceDate: '2025-05-07',
            });
            expect(age).to.equal(25);
        });

        it('should return detailed age in years, months, and days', () => {
            const age = ChronoUtilz.calculateAge('1990-06-15', {
                referenceDate: '2025-05-07',
                units: ['year', 'month', 'day'],
            });
            expect(age).to.have.all.keys('years', 'months', 'days');
        });
    });
    
});