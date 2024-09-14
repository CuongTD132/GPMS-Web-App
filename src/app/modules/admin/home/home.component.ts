import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
    standalone: true,
})
export class HomeComponent implements OnInit {
    user: User;

    constructor(
        private _userService: UserService,
        private _router: Router
    ) {}

    ngOnInit() {
        this._userService.get().subscribe((user) => {
            this.user = user;
            this.redirectWithRole();
        });
    }

    redirectWithRole() {
        switch (this.user.role) {
            case 'Admin':
                this._router.navigate(['accounts']);
                break;
            case 'ProductionManager':
            case 'FactoryDirector':
                this._router.navigate(['products']);
                break;
            case 'ProductionStaff':
                this._router.navigate(['production-results']);
                break;
            case 'WarehouseManager':
                this._router.navigate(['warehouse-requests']);
                break;
            default:
                this._router.navigate(['/sign-out']);
                break;
        }
    }
}
