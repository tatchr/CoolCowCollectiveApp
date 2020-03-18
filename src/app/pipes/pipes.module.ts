import { NgModule } from '@angular/core';
import { GroupmilksalesbydatePipe } from 'src/app/pipes/milksales/groupmilksalesbydate.pipe';
import { GroupothersalesbydatePipe } from './othersales/groupothersalesbydate.pipe';


@NgModule({
declarations: [GroupmilksalesbydatePipe, GroupothersalesbydatePipe],
imports: [],
exports: [GroupmilksalesbydatePipe, GroupothersalesbydatePipe],
})

export class PipesModule {}