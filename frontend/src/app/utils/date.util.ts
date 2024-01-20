import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export const convertToIsoString = (dateObject: NgbDate) =>
  new Date(dateObject.year, dateObject.month - 1, dateObject.day)
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
