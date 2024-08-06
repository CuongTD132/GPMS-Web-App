import { Component, Inject, OnInit } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'process-step-io-detail',
    templateUrl: 'process-step-io-detail.component.html',
    standalone: true,
    imports: [MatIconModule],
})
export class ProcessStepIoDetailDetailComponent implements OnInit {
    processStepIO: ProductionProcessStepIOs;
    constructor(
        public matDialogRef: MatDialogRef<ProcessStepIoDetailDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ProductionProcessStepIOs,
        private _dialog: MatDialog
    ) {}

    ngOnInit() {
        this.processStepIO = this.data;
    }

    openInputOutputDetailDialog(processStepIO: ProductionProcessStepIOs) {
        this._dialog
            .open(ProcessStepIoDetailDetailComponent, {
                width: '680px',
                data: processStepIO,
            })
            .afterClosed()
            .subscribe();
    }
}
