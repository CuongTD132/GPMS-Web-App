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
import { ProcessListComponent } from './processes-list/processes-list.component';

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
        console.log(this.seriesList);
    }

    openProcessListDialog(id: string) {
        this._processService
            .getProcessListBySeriesId(id)
            .subscribe((processes) => {
                this.processesList = processes;
                console.log(this.processesList);
                const data = {
                    seriesId: id,
                    processesList: this.processesList,
                };
                this._dialog
                    .open(ProcessListComponent, {
                        width: '900px',
                        data: data,
                    })
                    .afterClosed()
                    .subscribe();
            });
    }
}
