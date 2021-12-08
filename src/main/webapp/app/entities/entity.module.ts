import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'book',
        loadChildren: () => import('./book/book.module').then(m => m.ClubManagerBookModule),
      },
      {
        path: 'location',
        loadChildren: () => import('./location/location.module').then(m => m.ClubManagerLocationModule),
      },
      {
        path: 'club',
        loadChildren: () => import('./club/club.module').then(m => m.ClubManagerClubModule),
      },
      {
        path: 'member',
        loadChildren: () => import('./member/member.module').then(m => m.ClubManagerMemberModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class ClubManagerEntityModule {}
