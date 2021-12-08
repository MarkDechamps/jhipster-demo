import { Moment } from 'moment';
import { ILocation } from 'app/shared/model/location.model';
import { IBook } from 'app/shared/model/book.model';
import { IClub } from 'app/shared/model/club.model';

export interface IMember {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  inscription?: Moment;
  address?: ILocation;
  books?: IBook[];
  club?: IClub;
}

export class Member implements IMember {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public phoneNumber?: string,
    public inscription?: Moment,
    public address?: ILocation,
    public books?: IBook[],
    public club?: IClub
  ) {}
}
