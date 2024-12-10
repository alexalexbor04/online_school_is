-- Таблица roles
CREATE TABLE roles (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       name VARCHAR(50) NOT NULL DEFAULT 3
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица users
CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role_id INT NOT NULL,
                       full_name VARCHAR(100) NOT NULL,
                       email VARCHAR(100) UNIQUE,
                       phone VARCHAR(15),
                       CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица courses
CREATE TABLE courses (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         course_name VARCHAR(100) NOT NULL,
                         description TEXT,
                         teacher_id INT,
                         CONSTRAINT fk_teacher_id FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица materials
CREATE TABLE materials (
                           id INT AUTO_INCREMENT PRIMARY KEY,
                           course_id INT NOT NULL,
                           title VARCHAR(100) NOT NULL,
                           file_path VARCHAR(255) NOT NULL,
                           CONSTRAINT fk_course_id_materials FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица schedule
CREATE TABLE schedule (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          course_id INT NOT NULL,
                          date DATE NOT NULL,
                          start_time TIME NOT NULL,
                          end_time TIME NOT NULL,
                          room VARCHAR(50),
                          CONSTRAINT fk_course_id_schedule FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица grades
CREATE TABLE grades (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        student_id INT NOT NULL,
                        course_id INT NOT NULL,
                        grade DECIMAL(4, 2) NOT NULL CHECK (grade >= 0 AND grade <= 100),
                        comment TEXT,
                        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT fk_student_id_grades FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
                        CONSTRAINT fk_course_id_grades FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Таблица attendance
CREATE TABLE attendance (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            student_id INT NOT NULL,
                            schedule_id INT NOT NULL,
                            status ENUM('Присутствовал', 'Отсутствовал') NOT NULL,
                            date DATE NOT NULL,
                            CONSTRAINT fk_student_id_attendance FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
                            CONSTRAINT fk_schedule_id_attendance FOREIGN KEY (schedule_id) REFERENCES schedule(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;





# drop table roles;
# drop table users;
# drop table courses;
# drop table schedule;
# drop table materials;
# drop table grades;
# drop table attendance;
