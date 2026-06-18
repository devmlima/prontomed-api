import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';
import { SexEnum } from '../../../2-domain/enums/sex.enum';

export class PatientEntity extends Model {
  public id!: string;
  public doctorId!: string;
  public name!: string;
  public phone!: string;
  public email!: string;
  public birthDate!: string;
  public gender!: SexEnum;
  public height!: number;
  public weight!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public deletedAt!: Date | null;
}

PatientEntity.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM(...Object.values(SexEnum)),
      allowNull: false,
    },
    height: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: 'patients',
    underscored: true,
  }
);
