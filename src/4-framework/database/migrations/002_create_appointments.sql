CREATE TABLE IF NOT EXISTS appointments (
  id               VARCHAR(36)                               NOT NULL,
  doctor_id        VARCHAR(36)                               NOT NULL,
  patient_id       VARCHAR(36)                               NOT NULL,
  scheduled_at     DATETIME                                  NOT NULL,
  duration_minutes INT                                       NOT NULL,
  status           ENUM('scheduled','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  created_at       TIMESTAMP                                 NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP                                 NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at       TIMESTAMP                                 NULL DEFAULT NULL,

  PRIMARY KEY (id),
  INDEX idx_appointments_doctor_scheduled (doctor_id, scheduled_at),
  CONSTRAINT fk_appointments_doctor
    FOREIGN KEY (doctor_id) REFERENCES doctors (id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_appointments_patient
    FOREIGN KEY (patient_id) REFERENCES patients (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
