import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IMember, Member } from 'app/shared/model/member.model';
import { MemberService } from './member.service';
import { ILocation } from 'app/shared/model/location.model';
import { LocationService } from 'app/entities/location/location.service';
import { IClub } from 'app/shared/model/club.model';
import { ClubService } from 'app/entities/club/club.service';

type SelectableEntity = ILocation | IClub;

@Component({
  selector: 'jhi-member-update',
  templateUrl: './member-update.component.html',
})
export class MemberUpdateComponent implements OnInit {
  isSaving = false;
  addresses: ILocation[] = [];
  clubs: IClub[] = [];

  editForm = this.fb.group({
    id: [],
    firstName: [],
    lastName: [],
    email: [],
    phoneNumber: [],
    inscription: [],
    address: [],
    club: [],
  });

  constructor(
    protected memberService: MemberService,
    protected locationService: LocationService,
    protected clubService: ClubService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ member }) => {
      if (!member.id) {
        const today = moment().startOf('day');
        member.inscription = today;
      }

      this.updateForm(member);

      this.locationService
        .query({ filter: 'member-is-null' })
        .pipe(
          map((res: HttpResponse<ILocation[]>) => {
            return res.body || [];
          })
        )
        .subscribe((resBody: ILocation[]) => {
          if (!member.address || !member.address.id) {
            this.addresses = resBody;
          } else {
            this.locationService
              .find(member.address.id)
              .pipe(
                map((subRes: HttpResponse<ILocation>) => {
                  return subRes.body ? [subRes.body].concat(resBody) : resBody;
                })
              )
              .subscribe((concatRes: ILocation[]) => (this.addresses = concatRes));
          }
        });

      this.clubService.query().subscribe((res: HttpResponse<IClub[]>) => (this.clubs = res.body || []));
    });
  }

  updateForm(member: IMember): void {
    this.editForm.patchValue({
      id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phoneNumber: member.phoneNumber,
      inscription: member.inscription ? member.inscription.format(DATE_TIME_FORMAT) : null,
      address: member.address,
      club: member.club,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const member = this.createFromForm();
    if (member.id !== undefined) {
      this.subscribeToSaveResponse(this.memberService.update(member));
    } else {
      this.subscribeToSaveResponse(this.memberService.create(member));
    }
  }

  private createFromForm(): IMember {
    return {
      ...new Member(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      email: this.editForm.get(['email'])!.value,
      phoneNumber: this.editForm.get(['phoneNumber'])!.value,
      inscription: this.editForm.get(['inscription'])!.value
        ? moment(this.editForm.get(['inscription'])!.value, DATE_TIME_FORMAT)
        : undefined,
      address: this.editForm.get(['address'])!.value,
      club: this.editForm.get(['club'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMember>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
