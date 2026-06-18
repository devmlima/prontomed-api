CREATE TABLE IF NOT EXISTS patients (
  id          CHAR(36)        NOT NULL,
  doctor_id   CHAR(36)        NOT NULL,
  name        VARCHAR(255)    NOT NULL,
  email       VARCHAR(255)    NOT NULL,
  phone       VARCHAR(20)     NOT NULL,
  birth_date  DATE            NOT NULL,
  gender      ENUM('M','F','O') NOT NULL,
  height      DECIMAL(4,2)    NOT NULL,
  weight      DECIMAL(5,2)    NOT NULL,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  TIMESTAMP       NULL DEFAULT NULL,

  PRIMARY KEY (id),
  CONSTRAINT fk_patients_doctor
    FOREIGN KEY (doctor_id) REFERENCES doctors (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
