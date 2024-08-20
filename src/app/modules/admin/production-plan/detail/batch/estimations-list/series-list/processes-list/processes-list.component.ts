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
import { StepsListComponent } from './steps-list/steps-list.component';

@Component({
    selector: 'processes-list',
    templateUrl: 'processes-list.component.html',
    styleUrls: ['processes-list.component.css'],
    standalone: true,
    imports: [MatIconModule, CommonModule, MatButtonModule],
})
export class ProcessListComponent implements OnInit {
    processList: Process[];
    constructor(
        public matDialogRef: MatDialogRef<ProcessListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Process[],
        private _stepService: StepService,
        private _dialog: MatDialog
    ) {}

    ngOnInit() {
        this.processList = this.data;
        console.log(this.processList);
    }

    openStepListDialog(id: string) {
        this._stepService.getStepListByProcessId(id).subscribe((steps) => {
            this._dialog
                .open(StepsListComponent, {
                    width: '900px',
                    data: steps.data,
                })
                .afterClosed()
                .subscribe();
        });
    }
}
