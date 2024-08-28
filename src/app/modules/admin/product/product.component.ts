import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'product',
    standalone: true,
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        RouterModule,
    ],
})
export class ProductComponent implements OnInit, AfterViewInit {
    ngOnInit(): void {
    }
    ngAfterViewInit(): void {
    }
}
