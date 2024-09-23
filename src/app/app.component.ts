import { Component, inject } from '@angular/core';
import { Messaging } from '@angular/fire/messaging';
import { RouterOutlet } from '@angular/router';
import { FcmService } from 'firebase-service';
// import { FcmService } from 'firebase-service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet],
})
export class AppComponent {
    private messaging = inject(Messaging);
    /**
     * Constructor
     */
    constructor(private fcm: FcmService) {
    }
}
