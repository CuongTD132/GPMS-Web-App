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

@Component({
    selector: 'stepIOs-list',
    templateUrl: 'stepIOs-list.component.html',
    styleUrls: ['stepIOs-list.component.css'],
    standalone: true,
    imports: [MatIconModule, CommonModule, MatButtonModule],
})
export class StepIOsListComponent implements OnInit {
    stepIOsList: IORespone;
    constructor(
        public matDialogRef: MatDialogRef<StepIOsListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: IORespone,
        private _stepService: StepService,
        private _dialog: MatDialog
    ) {}

    ngOnInit() {
        this.stepIOsList = this.data;
        console.log(this.stepIOsList);
    }

    // openProcessListDialog(id: string) {
    //     this._stepService.getStepListByProcessId(id).subscribe((steps) => {
    //         this._dialog
    //             .open(ProcessListComponent, {
    //                 width: '900px',
    //                 data: steps.data,
    //             })
    //             .afterClosed()
    //             .subscribe();
    //     });
    // }
}
