import { User } from '../models/User';

declare global {
  namespace Express {
    interface User extends UserModel {}
  }
}
/*import { User } from '../models/User';

declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      role?: string;
    }

    interface Request {
      user?: User;
    }
  }
} */