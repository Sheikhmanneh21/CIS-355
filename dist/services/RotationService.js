"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotationService = void 0;
const Schedule_1 = require("../models/Schedule");
class RotationService {
    static createSchedule(members, chores, weeks) {
        const assignments = [];
        // Assign colors to members
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF3'];
        members.forEach((member, i) => {
            member.color = colors[i % colors.length];
        });
        // Create assignments
        for (let week = 1; week <= weeks; week++) {
            chores.forEach(chore => {
                // Distribute chores evenly across the week
                for (let i = 0; i < chore.frequency; i++) {
                    const dayIndex = i % 7; // Spread across days
                    const memberIndex = (week + i) % members.length;
                    const member = members[memberIndex];
                    assignments.push(new Schedule_1.ScheduleAssignment(chore, member, week));
                }
            });
        }
        return new Schedule_1.Schedule(members, chores, assignments, weeks);
    }
}
exports.RotationService = RotationService;
/*import { Schedule, ScheduleAssignment } from "../models/Schedule";
import { FamilyMember } from "../models/FamilyMember";
import { Chore } from "../models/Chore";

export class RotationService {
    static createSchedule(
        members: FamilyMember[],
        chores: Chore[],
        weeks: number
    ): Schedule {
        const assignments: ScheduleAssignment[] = [];
        
        // Assign colors to members
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF', '#33FFF3'];
        members.forEach((member, i) => {
            member.color = colors[i % colors.length];
        });

        // Create assignments
        for (let week = 1; week <= weeks; week++) {
            chores.forEach(chore => {
                for (let i = 0; i < chore.frequency; i++) {
                    // Rotate members fairly
                    const memberIndex = (week + i) % members.length;
                    const member = members[memberIndex];
                    
                    assignments.push(new ScheduleAssignment(
                        chore,
                        member,
                        week
                    ));
                }
            });
        }

        return new Schedule(members, chores, assignments, weeks);
    }
} */ 
