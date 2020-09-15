import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExpensesChartComponent } from './expenses-chart/expenses-chart.component';

@NgModule({
    imports: [        
        IonicModule
    ],
    declarations: [ExpensesChartComponent],
    exports: [ExpensesChartComponent]
})
export class FarmDashboardChartComponentsModule{}