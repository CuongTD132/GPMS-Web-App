import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { StepService } from 'app/modules/admin/step/step.service';
import { StepIOsListComponent } from './stepIOs-list/stepIOs-lists.component';
@Component({
    selector: 'steps-list',
    templateUrl: 'steps-list.component.html',
    styleUrls: ['steps-list.component.css'],
    standalone: true,
    imports: [MatIconModule, CommonModule, MatButtonModule],
})
export class StepsListComponent implements OnInit {
    stepsList: Step[];
    constructor(
        public matDialogRef: MatDialogRef<StepsListComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            seriesId: string;
            stepsList: Step[];
        },
        private _stepService: StepService,
        private _dialog: MatDialog
    ) {}

    ngOnInit() {
        this.stepsList = this.data.stepsList;
        console.log(this.stepsList);
    }

    openStepIOListDialog(id: string) {
        this._stepService
            .getStepIOListByStepId(id, this.data.seriesId)
            .subscribe((stepIOs) => {
                const data = {
                    seriesId: this.data.seriesId,
                    stepIOsList: stepIOs.data,
                    stepId: id,
                };
                this._dialog
                    .open(StepIOsListComponent, {
                        width: '900px',
                        data: data,
                    })
                    .afterClosed()
                    .subscribe();
            });
    }
}
