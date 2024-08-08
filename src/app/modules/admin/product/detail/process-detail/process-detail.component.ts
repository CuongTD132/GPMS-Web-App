import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ProcessStepIoDetailComponent } from './process-step-io-detail/process-step-io-detail.component';

@Component({
    selector: 'process-detail',
    templateUrl: 'process-detail.component.html',
    styleUrls: ['process-detail.component.css'],
    standalone: true,
    imports: [MatIconModule, CommonModule],
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

    openInputOutputDetailDialog(processStepIO: ProductionProcessStepIOs) {
        this._dialog
            .open(ProcessStepIoDetailComponent, {
                width: '860px',
                data: processStepIO,
            })
            .afterClosed()
            .subscribe();
    }
}
