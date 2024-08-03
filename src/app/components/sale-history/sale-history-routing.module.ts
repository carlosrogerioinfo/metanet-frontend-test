import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SaleHistoryComponent } from './sale-history.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: SaleHistoryComponent }
	])],
	exports: [RouterModule]
})
export class SaleHistoryRoutingModule { }
