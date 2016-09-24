import {Component} from '@angular/core';
import {NavParams, ViewController} from 'ionic-angular';
import {Moment} from 'moment';
import {DateFormatPipe} from 'angular2-moment';

import {DurationPipe} from '../../pipes/duration-pipe.ts';

@Component({
    templateUrl: 'build/components/booking-more/booking-more.html',
    pipes: [DurationPipe, DateFormatPipe]
})
export class BookingMore {

    bookingsMore: {inclBooked: boolean,totalSumOfBookings: number,datesOfBookingsView: {first: Moment,last: Moment}}
    bookingsLabel: string;

    constructor(private params: NavParams, private viewCtrl: ViewController) {
        this.bookingsMore.inclBooked = params.get('inclBooked');
        this.bookingsMore.datesOfBookingsView = params.get('datesOfBookingsView');
        this.bookingsMore.totalSumOfBookings = params.get('totalSumOfBookings');
        this.bookingsLabel = params.get('bookingsLabel');
    }

    cancel() {
        this.viewCtrl.dismiss({inclBooked: this.bookingsMore.inclBooked});
    }
}