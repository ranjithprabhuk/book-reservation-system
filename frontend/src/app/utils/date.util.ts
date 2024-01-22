import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export const convertToIsoString = (dateObject: NgbDate) =>
  new Date(dateObject.year, dateObject.month - 1, dateObject.day + 1)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');


export const formatToTwoDigits = (value: number) => {
  const stringValue = String(value);
  return stringValue.length === 1 ? `0${stringValue}` : stringValue;
}