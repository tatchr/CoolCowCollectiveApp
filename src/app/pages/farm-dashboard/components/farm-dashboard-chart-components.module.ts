import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExpensesChartComponent } from './expenses-chart/expenses-chart.component';
import { MilkProductionChartComponent } from './milk-production-chart/milk-production-chart.component';

@NgModule({
    imports: [        
        IonicModule
    ],
    declarations: [ExpensesChartComponent, MilkProductionChartComponent],
    exports: [ExpensesChartComponent, MilkProductionChartComponent]
})
export class FarmDashboardChartComponentsModule{}