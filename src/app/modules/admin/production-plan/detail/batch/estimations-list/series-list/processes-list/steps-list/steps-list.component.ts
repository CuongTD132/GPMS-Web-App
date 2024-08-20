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
import { data } from './stepIOs-list/data';
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
        @Inject(MAT_DIALOG_DATA) public data: Step[],
        private _stepService: StepService,
        private _dialog: MatDialog
    ) {}

    ngOnInit() {
        this.stepsList = this.data;
        console.log(this.stepsList);
    }

    openStepListDialog(id: string) {
        // this._stepService.getStepListByProcessId(id).subscribe((steps) => {
        this._dialog
            .open(StepIOsListComponent, {
                width: '900px',
                data: data,
            })
            .afterClosed()
            .subscribe();
        // });
    }
}
