import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'specification-detail',
    templateUrl: 'specification-detail.component.html',
    standalone: true,
    imports: [MatIconModule],
})
export class SpecificationDetailComponent implements OnInit {
    specification: Specification;
    constructor(
        public matDialogRef: MatDialogRef<SpecificationDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Specification
    ) {}

    ngOnInit() {
        this.specification = this.data;
    }
}
