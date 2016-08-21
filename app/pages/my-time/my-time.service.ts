import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';

import * as _ from 'lodash';
import {Moment} from 'moment';

import {WorkingStepsData} from './working-steps-test-data';

@Injectable()
export class MyTimeService {

    workingSteps = WorkingStepsData;

    constructor(private http: Http) {
    }

    getWorkingSteps(from: Moment, to: Moment, inclBooked: boolean, memberId: String, tenant: string) {
        // allTenants: false
        //TODO temporary without observable
        return this.http.get('http://localhost:3000/workingSteps').map(res => {
            let query = _.chain(res.json()).filter(function (item) {
                return from.toDate().getTime() <= item.date && item.date <= to.toDate().getTime();
            }).groupBy('date').value();
            let list = [];
            _.forIn(query, function (value, key) {
                list.push({date: parseInt(key),sumOfDuration: _.sumBy(value,'duration'),values: value});
            });
            return list;
        }).catch(error => {
            console.log('service', error);
            return Observable.throw(error);
        });
    }

    deleteWorkingStep(workingStep) {
        return this.http.delete('http://localhost:3000/workingSteps/' + workingStep.id).map(() => {
        }).catch(error => {
            console.log('service', error);
            return Observable.throw(error);
        });
    }
}