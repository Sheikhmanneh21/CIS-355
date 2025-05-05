import { Model, DataTypes, BuildOptions, CreationOptional } from 'sequelize';
import * as bcrypt from 'bcryptjs';
import db from '../config/database';

interface UserAttributes {
  id: CreationOptional<number>;
  username: string;
  password: string;
  createdAt?: CreationOptional<Date>;
  updatedAt?: CreationOptional<Date>;
}

interface UserInstance extends Model<UserAttributes>, UserAttributes {
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const User = db.define<UserInstance>('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 100]
    }
  }
}, {
  hooks: {
    beforeCreate: async (user: UserInstance) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  },
  timestamps: true
});

// Add instance method
User.prototype.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default User;
/*import { Model, DataTypes } from 'sequelize';
import * as bcrypt from 'bcryptjs';  // Updated import syntax
import db from '../config/database';

interface UserAttributes {
  id: number;
  username: string;
  password: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
  declare id: number;
  declare username: string;
  declare password: string;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: { 
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: db,
  modelName: 'user',
  hooks: {
    beforeCreate: async (user: User) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }
});

export default User;
/*import { Model, DataTypes } from 'sequelize';
import db from '../config/database';
import bcrypt from 'bcryptjs';

// Add this interface
interface UserAttributes {
  id: number;
  username: string;
  password: string;
}

// Extend Model with UserAttributes
class User extends Model<UserAttributes> implements UserAttributes {
  declare id: number;
  declare username: string;
  declare password: string;

  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: { 
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: db,
  modelName: 'user',
  hooks: {
    beforeCreate: async (user: User) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }
});

export default User;
/* models/User.ts
import { Model, DataTypes } from 'sequelize';
import db from '../config/database';

class User extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
}

User.init({
  username: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING
}, { sequelize: db, modelName: 'user' });*/