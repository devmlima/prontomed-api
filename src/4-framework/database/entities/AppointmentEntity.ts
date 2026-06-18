import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';
import { AppointmentStatusEnum } from '../../../2-domain/enums/appointment-status.enum';

export class AppointmentEntity extends Model {
  public id!: string;
  public doctorId!: string;
  public patientId!: string;
  public scheduledAt!: string;
  public durationMinutes!: number;
  public status!: AppointmentStatusEnum;
  public notes!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public deletedAt!: Date | null;
}

AppointmentEntity.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    doctorId: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    patientId: {
      type: DataTypes.STRING(36),
      allowNull: false,
    },
    scheduledAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(AppointmentStatusEnum)),
      allowNull: false,
      defaultValue: AppointmentStatusEnum.SCHEDULED,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: 'appointments',
    underscored: true,
  }
);
