import { format, addDays } from 'date-fns';
import { Schedule } from "../models/Schedule";

export class CalendarService {
    static generateCalendar(schedule: Schedule, startDate: Date = new Date()) {
        const weeks: any[] = [];
        
        for (let week = 1; week <= schedule.weeksToSchedule; week++) {
            const weekStart = addDays(startDate, (week - 1) * 7);
            
            const weekData = {
                number: week,
                startDate: format(weekStart, 'MMM dd, yyyy'),
                days: Array(7).fill(null).map((_, dayIndex) => {
                    const currentDate = addDays(weekStart, dayIndex);
                    return {
                        date: format(currentDate, 'EEEE, MMM dd'),
                        shortDate: format(currentDate, 'EEE'),
                        assignments: schedule.assignments
                            .filter(a => a.week === week)
                            // Distribute chores evenly across days
                            .filter((_, i) => i % 7 === dayIndex)
                            .map(a => ({
                                chore: a.chore.name,
                                member: a.member.name,
                                color: a.member.color
                            }))
                    };
                })
            };
            
            weeks.push(weekData);
        }
        
        return weeks;
    }
}/*import { format, addDays } from 'date-fns';
import { Schedule } from "../models/Schedule";

export class CalendarService {
    static generateCalendar(schedule: Schedule, startDate: Date = new Date()) {
        const weeks: any[] = [];
        
        for (let week = 1; week <= schedule.weeksToSchedule; week++) {
            const weekStart = addDays(startDate, (week - 1) * 7);
            const weekEnd = addDays(weekStart, 6);
            
            const weekData = {
                number: week,
                startDate: format(weekStart, 'MMM dd'),
                endDate: format(weekEnd, 'MMM dd, yyyy'),
                assignments: schedule.assignments
                    .filter(a => a.week === week)
                    .map(a => ({
                        chore: a.chore.name,
                        member: a.member.name,
                        color: a.member.color
                    }))
            };
            
            weeks.push(weekData);
        }
        
        return weeks;
    }
}*/