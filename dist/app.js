"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_handlebars_1 = require("express-handlebars");
const path = __importStar(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const auth_1 = __importDefault(require("./config/auth"));
const database_1 = __importDefault(require("./config/database"));
const auth_2 = __importDefault(require("./routes/auth"));
const chores_1 = __importDefault(require("./routes/chores"));
const RotationService_1 = require("./services/RotationService");
const CalenderService_1 = require("./services/CalenderService");
const FamilyMember_1 = require("./models/FamilyMember");
const Chore_1 = __importDefault(require("./models/Chore"));
const auth_3 = require("./Middleware/auth");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Database connection
database_1.default.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));
// Configure Handlebars
app.engine('hbs', (0, express_handlebars_1.engine)({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
// Middleware
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.static(path.join(__dirname, 'public')));
// Session configuration
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));
// Passport middleware
app.use(auth_1.default.initialize());
app.use(auth_1.default.session());
// Routes
app.use('/auth', auth_2.default);
app.use('/chores', auth_3.isAuthenticated, chores_1.default);
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});
app.get('/setup', auth_3.isAuthenticated, (req, res) => {
    res.render('setup', { user: req.user });
});
app.post('/generate-schedule', auth_3.isAuthenticated, (req, res) => {
    try {
        const { members, chores, weeks } = req.body;
        // Validate weeks input
        const weeksNum = parseInt(weeks, 10);
        if (isNaN(weeksNum) || weeksNum < 1) {
            throw new Error('Invalid number of weeks specified');
        }
        // Process family members
        const familyMembers = members.split(',')
            .map((name, i) => {
            const trimmedName = name.trim();
            if (!trimmedName)
                throw new Error('Family member name cannot be empty');
            return new FamilyMember_1.FamilyMember(i + 1, trimmedName, '');
        });
        // Process chores
        const choreList = chores.split('\n')
            .map((line, i) => {
            const [name, freq] = line.split(':');
            const trimmedName = name.trim();
            const trimmedFreq = (freq || '1').trim();
            if (!trimmedName)
                throw new Error('Chore name cannot be empty');
            const frequency = parseInt(trimmedFreq, 10);
            if (isNaN(frequency)) {
                throw new Error(`Invalid frequency value for chore: ${trimmedName}`);
            }
            return Chore_1.default.build({
                name: trimmedName,
                frequency: frequency,
                userId: req.user?.id || 0 // Provide fallback if undefined
            });
        });
        /*const choreList = chores.split('\n')
        .map((line: string, i: number) => {
            const [name, freq] = line.split(':');
            const trimmedName = name.trim();
            const trimmedFreq = freq?.trim() || '1'; // Default frequency if missing
            
            if (!trimmedName) throw new Error('Chore name cannot be empty');
            
            const frequency = parseInt(trimmedFreq, 10);
            if (isNaN(frequency) || frequency < 1) {
                throw new Error(`Invalid frequency for chore: ${trimmedName}`);
            }
    
            return Chore.build({
                id: i + 1,
                name: trimmedName,
                frequency: frequency,
                userId: req.user?.id || 0 // Add proper user ID handling
            });
        });*/
        // Generate schedule
        const schedule = RotationService_1.RotationService.createSchedule(familyMembers, choreList, weeksNum);
        // Generate calendar view
        const calendar = CalenderService_1.CalendarService.generateCalendar(schedule);
        res.render('calendar', {
            members: familyMembers,
            chores: choreList,
            weeks: calendar,
            user: req.user
        });
    }
    catch (error) {
        console.error('Error generating schedule:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).render('error', {
            message: `Error generating schedule: ${message}`,
            user: req.user
        });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
