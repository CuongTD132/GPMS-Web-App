import { Injectable } from '@angular/core';
import { Messaging, deleteToken } from '@angular/fire/messaging';

@Injectable({
    providedIn: 'root',
})
export class FcmService {
    constructor(private msg: Messaging) {
        // Notification.requestPermission().then(
        //     (notificationPermissions: NotificationPermission) => {
        //         if (notificationPermissions === 'granted') {
        //             console.log('Granted');
        //         }
        //         if (notificationPermissions === 'denied') {
        //             console.log('Denied');
        //         }
        //     }
        // );
        // navigator.serviceWorker
        //     .register('firebase-messaging-sw.js', {
        //         type: 'module',
        //     })
        //     .then((serviceWorkerRegistration) => {
        //         getToken(this.msg, {
        //             vapidKey: `BJf1RyYSRSiKXLp1jps0fg8oAEOwge0jyxkb-GqtsU2Sp1M7YxeDL3ruWFNU2aG2p2tNgwj6w9yqfmRCja9peeY`,
        //             serviceWorkerRegistration: serviceWorkerRegistration,
        //         }).then((x) => {
        //             console.log('my fcm token', x);
        //             // This is a good place to then store it on your database for each user
        //         });
        //     });
        // onMessage(msg, (payload) => console.log(payload));
        // let message$ = new Observable((sub) =>
        //     onMessage(this.msg, (msg) => sub.next(msg))
        // ).pipe(
        //     tap((msg) => {
        //         console.log('My Firebase Cloud Message', msg);
        //     })
        // );
    }
    deleteToken() {
        // We can also delete fcm tokens, make sure to also update this on your firestore db if you are storing them as well
        deleteToken(this.msg);
    }
}
