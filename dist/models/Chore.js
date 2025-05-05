"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Chore = database_1.default.define('Chore', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    frequency: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    timestamps: true
});
exports.default = Chore;
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
