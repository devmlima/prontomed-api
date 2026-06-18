import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';

export class DoctorEntity extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public crm!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;
}

DoctorEntity.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    crm: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'doctors',
    underscored: true,
    paranoid: true,
  }
);
