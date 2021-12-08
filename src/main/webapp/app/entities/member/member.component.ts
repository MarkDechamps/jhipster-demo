import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMember } from 'app/shared/model/member.model';

import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { MemberService } from './member.service';
import { MemberDeleteDialogComponent } from './member-delete-dialog.component';

@Component({
  selector: 'jhi-member',
  templateUrl: './member.component.html',
})
export class MemberComponent implements OnInit, OnDestroy {
  members: IMember[];
  eventSubscriber?: Subscription;
  itemsPerPage: number;
  links: any;
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(
    protected memberService: MemberService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    protected parseLinks: JhiParseLinks
  ) {
    this.members = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.memberService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<IMember[]>) => this.paginateMembers(res.body, res.headers));
  }

  reset(): void {
    this.page = 0;
    this.members = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInMembers();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IMember): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInMembers(): void {
    this.eventSubscriber = this.eventManager.subscribe('memberListModification', () => this.reset());
  }

  delete(member: IMember): void {
    const modalRef = this.modalService.open(MemberDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.member = member;
  }

  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateMembers(data: IMember[] | null, headers: HttpHeaders): void {
    const headersLink = headers.get('link');
    this.links = this.parseLinks.parse(headersLink ? headersLink : '');
    if (data) {
      for (let i = 0; i < data.length; i++) {
        this.members.push(data[i]);
      }
    }
  }
}
