import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { SpecificationService } from 'app/modules/admin/specification/specification.service';

@Component({
    selector: 'specification-detail',
    templateUrl: 'specification-detail.component.html',
    styleUrls: ['specification-detail.component.css'],
    standalone: true,
    imports: [MatIconModule, CommonModule],
})
export class SpecificationDetailComponent implements OnInit {
    specification: Specification;
    constructor(
        public matDialogRef: MatDialogRef<SpecificationDetailComponent>,
        private _specificationService: SpecificationService
    ) {}

    ngOnInit() {
        this._specificationService.specification$.subscribe((specification) => {
            this.specification = specification;
        });
    }
}
