import express, { Express, Request, Response } from 'express';
import { engine } from 'express-handlebars';
import * as path from 'path';
import session from 'express-session';
import passport from './config/auth';
import db from './config/database';
import  authRoutes from './routes/auth';
import choreRoutes from './routes/chores';
import cors from 'cors';
import helmet from 'helmet';

// Type declarations
declare module 'express-session' {
  interface SessionData {
    passport: {
      user: number;
    };
  }
}

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Database connection
db.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

// Configure Handlebars
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/chores', choreRoutes);

app.get('/', (req: Request, res: Response) => {
  res.render('home', { user: req.user });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
/*import express, { Express, Request, Response } from 'express';
import { engine } from 'express-handlebars';
import * as path from 'path';
import session from 'express-session';
import passport from './config/auth';
import db from './config/database';
import authRoutes from './routes/auth';
import choreRoutes from './routes/chores';
import { RotationService } from './services/RotationService';
import { CalendarService } from './services/CalenderService';
import { FamilyMember } from './models/FamilyMember';
import Chore from './models/Chore';
import { isAuthenticated } from './Middleware/auth';


declare module 'express-session' {
  interface SessionData {
    passport: {
      user: number;
    };
  }
}

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Database connection
db.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

// Configure Handlebars
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/chores', isAuthenticated, choreRoutes);

app.get('/', (req: Request, res: Response) => {
    res.render('home', { user: req.user });
});

app.get('/setup', isAuthenticated, (req: Request, res: Response) => {
    res.render('setup', { user: req.user });
});

app.post('/generate-schedule', isAuthenticated, (req: Request, res: Response) => {
    try {
        const { members, chores, weeks } = req.body;
        
        // Validate weeks input
        const weeksNum = parseInt(weeks, 10);
        if (isNaN(weeksNum) || weeksNum < 1) {
            throw new Error('Invalid number of weeks specified');
        }

        // Process family members
        const familyMembers = members.split(',')
            .map((name: string, i: number) => {
                const trimmedName = name.trim();
                if (!trimmedName) throw new Error('Family member name cannot be empty');
                return new FamilyMember(i + 1, trimmedName, '');
            });

        // Process chores
        const choreList = chores.split('\n')
  .map((line: string, i: number) => {
    const [name, freq] = line.split(':');
    const trimmedName = name.trim();
    const trimmedFreq = (freq || '1').trim();
    
    if (!trimmedName) throw new Error('Chore name cannot be empty');
    
    const frequency = parseInt(trimmedFreq, 10);
    if (isNaN(frequency)) {
      throw new Error(`Invalid frequency value for chore: ${trimmedName}`);
    }

    return Chore.build({
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

        /* Generate schedule
        const schedule = RotationService.createSchedule(
            familyMembers,
            choreList,
            weeksNum
        );
        
        // Generate calendar view
        const calendar = CalendarService.generateCalendar(schedule);
        
        res.render('calendar', {
            members: familyMembers,
            chores: choreList,
            weeks: calendar,
            user: req.user
        });
    } catch (error: unknown) {
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
});*/