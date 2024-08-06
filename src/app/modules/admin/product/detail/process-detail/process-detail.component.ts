import { Component, Inject, OnInit } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'process-detail',
    templateUrl: 'process-detail.component.html',
    standalone: true,
    imports: [MatIconModule],
})
export class ProcessDetailComponent implements OnInit {
    process: Process;
    constructor(
        public matDialogRef: MatDialogRef<ProcessDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Process,
        private _dialog: MatDialog
    ) {}

    ngOnInit() {
        this.process = this.data;
    }

    openInputOutputDetailDialog(process: Process) {
        this._dialog
            .open(ProcessDetailComponent, {
                width: '680px',
                data: process,
            })
            .afterClosed()
            .subscribe();
    }
}
