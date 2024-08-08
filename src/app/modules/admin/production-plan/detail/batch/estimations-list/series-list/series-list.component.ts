import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'series-list.',
    templateUrl: 'series-list.component.html',
    styleUrls: ['series-list.component.css'],
    standalone: true,
    imports: [MatIconModule, CommonModule],
})
export class SeriesListComponent implements OnInit {
    seriesList: ProductionSeries[];
    constructor(
        public matDialogRef: MatDialogRef<SeriesListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ProductionSeries[],
    ) {}

    ngOnInit() {
        this.seriesList = this.data;
        console.log(this.seriesList);
    }
}
