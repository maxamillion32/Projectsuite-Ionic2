import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable}     from 'rxjs/Observable';
import * as moment from 'moment';
import * as _ from 'lodash';

import {API_ENDPOINT} from '../../constants/app-settings';

@Injectable()
export class WorkingStepService {

  constructor(private http: Http) {}

  getTaskCategoriesAndAssigments(task: Object, date: string) {
    return Observable.forkJoin(this.http.get(API_ENDPOINT + '/taskCategories').map(res => {
      return res.json();
    }).catch(error => {
      console.log('service', error);
      return Observable.throw(error);
    }), this.http.get(API_ENDPOINT + '/taskAssigments').map(res => {
      return res.json();
    }).catch(error => {
      console.log('service', error);
      return Observable.throw(error);
    }));
  }


  deleteWorkingStepFromList(workingStep, workingSteps) {
    workingSteps.forEach((item, index, array)=> {
      if (item.date === workingStep.date) {
        item.values.splice(item.values.findIndex((el)=> {
          return el.id === workingStep.id;
        }), 1);
        if (item.values.length === 0) {
          array.splice(index, 1);
        }
      }
    });
  }


  addWorkingStepToList(workingStep, workingSteps) {
    let all = [];
    //ungroup all working steps
    workingSteps.forEach(ws=> {
      all = all.concat(ws.values);
    });
    //add new working into list
    all.push(workingStep);
    return this.packWorkingStepsToFormat(all);
  }

  packWorkingStepsToFormat(workingSteps) {
    let list = [];
    let totalSum = 0;
    //group working steps by date
    const grouped = _.groupBy(workingSteps, 'date');
    _.forIn(grouped, (value, key)=> {
      let sumOfDuration = _.sumBy(value, 'duration');
      totalSum += sumOfDuration;
      list.push({date: parseInt(key), sumOfDuration: sumOfDuration, values: value});
    });
    const firstLast = list.length === 0 ? null : {
      first: moment(parseInt(_.minBy(list, 'date').date)),
      last: moment(parseInt(_.maxBy(list, 'date').date))
    }
    return {
      list: list,
      totalSum: totalSum,
      firstLast: firstLast
    }
  }

  deleteWorkingStep(workingStep) {
    return this.http.delete(API_ENDPOINT + '/workingSteps/' + workingStep.id).map(() => {
    }).catch(error => {
      console.log('service', error);
      return Observable.throw(error);
    });
  }

  editWorkingStep(workingStep) {
    //TODO just with json-server
    return Observable.forkJoin(this.deleteWorkingStep(workingStep), this.createWorkingStep(workingStep));
  }

  createWorkingStep(newWorkingStep) {
    //TODO taskId property was renamed to task because of json-server
    let temp = moment(newWorkingStep.bookingDate);
    let date = moment({day: temp.date(), month: temp.month(), year: temp.year()});
    let req = {
      id: moment().toISOString(),
      date: date.toDate().getTime(),
      taskName: newWorkingStep.task.name,
      projectName: newWorkingStep.task.project.name,
      tenant: 'A',
      duration: parseFloat(newWorkingStep.duration),
      durationType: 1,
      category: newWorkingStep.taskCategory,
      activity: newWorkingStep.activity,
      booked: false,
      task: newWorkingStep.task.id,
      number: 1234
    };
    return this.http.post(API_ENDPOINT + '/workingSteps/', req).map(()=> {
      return req;
    }).catch(error => {
      console.log('service', error);
      return Observable.throw(error);
    });
  }

}

