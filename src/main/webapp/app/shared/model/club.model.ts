import { ILocation } from 'app/shared/model/location.model';
import { IBook } from 'app/shared/model/book.model';

export interface IClub {
  id?: number;
  title?: string;
  description?: string;
  address?: ILocation;
  books?: IBook[];
}

export class Club implements IClub {
  constructor(public id?: number, public title?: string, public description?: string, public address?: ILocation, public books?: IBook[]) {}
}
