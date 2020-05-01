import { NgModule } from '@angular/core';
import { GroupmilksalesbydatePipe } from 'src/app/pipes/milksales/groupmilksalesbydate.pipe';
import { GroupothersalesbydatePipe } from './othersales/groupothersalesbydate.pipe';
import { GroupexpensesbydatePipe } from './expenses/groupexpensesbydate.pipe';


@NgModule({
declarations: [GroupmilksalesbydatePipe, GroupothersalesbydatePipe, GroupexpensesbydatePipe],
imports: [],
exports: [GroupmilksalesbydatePipe, GroupothersalesbydatePipe, GroupexpensesbydatePipe],
})

export class PipesModule {}