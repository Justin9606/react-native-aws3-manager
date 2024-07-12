/**
 * DateUtils
 */

const YYYYMMDD = "yyyymmdd";
const ISO8601 = "iso8601";
const AMZ_ISO8601 = "amz-iso8601";

const formatters: { [key: string]: (date: Date) => string } = {
  [ISO8601]: (date: Date) => date.toISOString(),
  [YYYYMMDD]: (date: Date) =>
    formatters[ISO8601](date).slice(0, 10).replace(/-/g, ""),
  [AMZ_ISO8601]: (date: Date) => `${formatters[YYYYMMDD](date)}T000000Z`,
};

export const dateToString = (date: Date, format: string = ISO8601) =>
  formatters[format](date);
