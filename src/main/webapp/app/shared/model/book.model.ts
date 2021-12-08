import { IClub } from 'app/shared/model/club.model';
import { IMember } from 'app/shared/model/member.model';

export interface IBook {
  id?: number;
  title?: string;
  targetRating?: number;
  club?: IClub;
  member?: IMember;
}

export class Book implements IBook {
  constructor(public id?: number, public title?: string, public targetRating?: number, public club?: IClub, public member?: IMember) {}
}
