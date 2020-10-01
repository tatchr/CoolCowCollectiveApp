import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CowPodiumChartComponent } from './cow-podium-chart/cow-podium-chart.component';
import { ExpensesChartComponent } from './expenses-chart/expenses-chart.component';
import { MilkProductionChartComponent } from './milk-production-chart/milk-production-chart.component';

@NgModule({
    imports: [        
        IonicModule
    ],
    declarations: [ExpensesChartComponent, MilkProductionChartComponent, CowPodiumChartComponent],
    exports: [ExpensesChartComponent, MilkProductionChartComponent, CowPodiumChartComponent]
})
export class FarmDashboardChartComponentsModule{}