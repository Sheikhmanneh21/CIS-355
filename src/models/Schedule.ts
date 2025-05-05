import { FamilyMember } from "./FamilyMember";
import { Chore } from "./Chore";

export class ScheduleAssignment {
    constructor(
        public chore: Chore,
        public member: FamilyMember,
        public week: number
    ) {}
}

export class Schedule {
    constructor(
        public members: FamilyMember[],
        public chores: Chore[],
        public assignments: ScheduleAssignment[],
        public weeksToSchedule: number
    ) {}
}