import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'process-step-io-detail',
    templateUrl: 'process-step-io-detail.component.html',
    styleUrls: ['process-step-io-detail.component.css'],
    standalone: true,
    imports: [MatIconModule, CommonModule],
})
export class ProcessStepIoDetailComponent implements OnInit {
    processStepIOs: ProductionProcessStepIOs[];
    constructor(
        public matDialogRef: MatDialogRef<ProcessStepIoDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ProductionProcessStepIOs[]
    ) {}

    ngOnInit() {
        this.processStepIOs = this.data;
        console.log(this.processStepIOs);
    }
}
