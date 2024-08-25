import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
    selector: 'step-detail',
    templateUrl: 'step-detail.component.html',
    styleUrls: ['step-detail.component.css'],
    standalone: true,
    imports: [MatIconModule, CommonModule, MatIconButton, MatTabsModule],
})
export class StepDetailComponent implements OnInit {
    stepDetail: StepDetail;
    constructor(
        public matDialogRef: MatDialogRef<StepDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: StepDetail
    ) {}

    ngOnInit() {
        this.stepDetail = this.data;
    }
}
