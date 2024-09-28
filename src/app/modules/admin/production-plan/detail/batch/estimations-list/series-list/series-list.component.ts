import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ProcessService } from 'app/modules/admin/process/process.service';

@Component({
    selector: 'series-list',
    templateUrl: 'series-list.component.html',
    styleUrls: ['series-list.component.css'],
    standalone: true,
    imports: [MatIconModule, CommonModule, MatButtonModule],
})
export class SeriesListComponent implements OnInit {
    seriesList: ProductionSeries[];
    processesList: Process[] = [];
    constructor(
        public matDialogRef: MatDialogRef<SeriesListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ProductionSeries[],
        private _processService: ProcessService,
        private _dialog: MatDialog
    ) {}

    ngOnInit() {
        this.seriesList = this.data;
        //console.log(this.seriesList);
    }
}
