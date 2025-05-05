"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = exports.ScheduleAssignment = void 0;
class ScheduleAssignment {
    constructor(chore, member, week) {
        this.chore = chore;
        this.member = member;
        this.week = week;
    }
}
exports.ScheduleAssignment = ScheduleAssignment;
class Schedule {
    constructor(members, chores, assignments, weeksToSchedule) {
        this.members = members;
        this.chores = chores;
        this.assignments = assignments;
        this.weeksToSchedule = weeksToSchedule;
    }
}
exports.Schedule = Schedule;
