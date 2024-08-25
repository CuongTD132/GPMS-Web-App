import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ProcessService } from 'app/modules/admin/process/process.service';
import { StepService } from 'app/modules/admin/step/step.service';
import { StepDetailComponent } from './step-detail/step-detail.component';

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
        private _dialog: MatDialog,
        private _processService: ProcessService,
        private _stepService: StepService
    ) {}

    ngOnInit() {
        this._processService.process$.subscribe((process) => {
            this.process = process;
        });
    }

    openStepDetailDialog(id: string) {
        this._stepService.getStepById(id).subscribe((step) => {
            if (step) {
                this._dialog
                    .open(StepDetailComponent, {
                        width: '860px',
                        data: step,
                    })
                    .afterClosed()
                    .subscribe();
            }
        });
    }
}
