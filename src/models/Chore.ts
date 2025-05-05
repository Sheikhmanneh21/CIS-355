import { Model, DataTypes, BuildOptions } from 'sequelize';
import db from '../config/database';

// Type for chore instance
interface ChoreAttributes {
  id?: number;
  name: string;
  frequency: number;
  userId: number;
}

// Type for static methods
interface ChoreModel extends Model<ChoreAttributes>, ChoreAttributes {}
type ChoreStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ChoreModel;
}

const Chore = db.define<ChoreModel>('Chore', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  frequency: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: true
}) as ChoreStatic;

export default Chore;
/*import { Model, DataTypes } from 'sequelize';
import db from '../config/database';

class Chore extends Model {
  public id!: number;
  public name!: string;
  public frequency!: number;
  public userId!: number;

  // Optional: Add constructor if you need explicit initialization
  constructor(values?: object, options?: object) {
    super(values, options);
  }
}

Chore.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  frequency: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  sequelize: db,
  modelName: 'chore',
  timestamps: true
});

export default Chore;
/*import { Model, DataTypes } from 'sequelize';
import db from '../config/database';

// In models/Chore.ts
class Chore extends Model {
  // Just properties, no constructor
  public id!: number;
  public name!: string;
  public frequency!: number;
  public userId!: number;
}

Chore.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  frequency: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  sequelize: db,
  modelName: 'chore'
});

export default Chore;
/*export class Chore {
    constructor(
        public id: number,
        public name: string,
        public frequency: number // Times per week
    ) {}
}*/