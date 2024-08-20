import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SeriesListComponent } from './series-list/series-list.component';

@Component({
    selector: 'batch-estimations-list.',
    templateUrl: 'estimations-list.component.html',
    styleUrls: ['estimations-list.component.css'],
    standalone: true,
    imports: [MatIconModule, CommonModule],
})
export class EstimationsListComponent implements OnInit {
    productionEstimations: ProductionEstimation[];
    constructor(
        public matDialogRef: MatDialogRef<EstimationsListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ProductionEstimation[],
        private _dialog: MatDialog
    ) {}

    ngOnInit() {
        this.productionEstimations = this.data;
        console.log(this.productionEstimations);
    }

    openSeriesListDialog(seriesList: ProductionSeries[]) {
        this._dialog
            .open(SeriesListComponent, {
                width: '900px',
                data: seriesList,
            })
            .afterClosed()
            .subscribe();
    }
}
