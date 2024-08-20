import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'process-step-detail',
    templateUrl: 'process-step-detail.component.html',
    styleUrls: ['process-step-detail.component.css'],
    standalone: true,
    imports: [MatIconModule, CommonModule, MatIconButton],
})
export class ProcessStepIoDetailComponent implements OnInit {
    step: StepDetail;
    constructor(
        public matDialogRef: MatDialogRef<ProcessStepIoDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: StepDetail
    ) {}

    ngOnInit() {
        this.step = this.data;
    }
}
