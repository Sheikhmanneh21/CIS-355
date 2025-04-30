/**
 * Models Index
 * 
 * This file serves as the central point for all database models.
 * It:
 * 1. Imports all models
 * 2. Sets up model associations
 * 3. Exports all models for use in the application
 */

import sequelize from '../config/database';
import { Project } from './Project';
import { Tag } from './Tag';
import { Task } from './Task';
import { User } from './User';

// Set up basic associations between models
User.hasMany(Task, { 
  as: 'tasks',
  foreignKey: 'userId',
  onDelete: 'CASCADE', // When a user is deleted, delete all their tasks
});

Task.belongsTo(User, { 
  as: 'user',
  foreignKey: 'userId',
});

Project.hasMany(Task, { 
  as: 'tasks',
  foreignKey: 'projectId',
  onDelete: 'CASCADE', // When a project is deleted, delete all its tasks
});

Task.belongsTo(Project, { 
  as: 'project',
  foreignKey: 'projectId',
});

Task.belongsToMany(Tag, { 
  through: 'TaskTags',
  as: 'tags',
  foreignKey: 'taskId',
});

Tag.belongsToMany(Task, { 
  through: 'TaskTags',
  as: 'tasks',
  foreignKey: 'tagId',
});


// Add global hooks for all models
//TODO: Implement global hooks for logging model changes

// This hook will be called whenever any model is created
sequelize.addHook('afterCreate', (instance, options) => {
  // Log the creation of a new record
  console.log(`[CREATE] ${instance.constructor.name} - ID: ${instance?.get?.('id')}`);
});

// This hook will be called whenever any model is updated
sequelize.addHook('afterUpdate', (instance, options) => {
  // Log the update of a record
  console.log(`[UPDATE] ${instance.constructor.name} - ID: ${instance?.get?.('id')}`);
});

// This hook will be called whenever any model is deleted
sequelize.addHook('afterDestroy', (instance, options) => {
  // Log the deletion  of a record
  console.log(`[DELETE] ${instance.constructor.name} - ID: ${instance?.get?.('id')}`);
});


// Export all models
export { Project, sequelize, Tag, Task, User };