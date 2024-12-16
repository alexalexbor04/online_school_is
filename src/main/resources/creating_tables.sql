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





drop table attendance;
drop table grades;
drop table materials;
drop table schedule;
drop table courses;
drop table users;
drop table roles;

INSERT INTO users (username, password, role_id, full_name, email, phone) VALUES
                                                                             ('admin1', 'password1', 1, 'Администратор Иванович', 'admin1@example.com', '1111111111'),
                                                                             ('teacher1', 'password2', 2, 'Преподаватель Иванов', 'teacher1@example.com', '2222222222'),
                                                                             ('teacher2', 'password3', 2, 'Преподаватель Петров', 'teacher2@example.com', '3333333333'),
                                                                             ('student1', 'password4', 3, 'Студент Сидоров', 'student1@example.com', '4444444444'),
                                                                             ('student2', 'password5', 3, 'Студент Смирнов', 'student2@example.com', '5555555555'),
                                                                             ('student3', 'password6', 3, 'Студент Кузнецов', 'student3@example.com', '6666666666'),
                                                                             ('student4', 'password7', 3, 'Студент Морозов', 'student4@example.com', '7777777777'),
                                                                             ('student5', 'password8', 3, 'Студент Новиков', 'student5@example.com', '8888888888'),
                                                                             ('student6', 'password9', 3, 'Студент Федоров', 'student6@example.com', '9999999999'),
                                                                             ('student7', 'password10', 3, 'Студент Васильев', 'student7@example.com', '1010101010');

INSERT INTO courses (course_name, description, teacher_id) VALUES
                                                               ('Java Programming', 'Курс по программированию на Java', 2),
                                                               ('Web Development', 'Курс по веб-разработке', 2),
                                                               ('Data Science', 'Основы анализа данных', 3),
                                                               ('Python Basics', 'Курс для начинающих по Python', 3),
                                                               ('Machine Learning', 'Основы машинного обучения', 3);

INSERT INTO materials (course_id, title, file_path) VALUES
                                                        (1, 'Java Introduction', '/files/java_intro.pdf'),
                                                        (1, 'Java Basics', '/files/java_basics.pdf'),
                                                        (2, 'HTML Basics', '/files/html_basics.pdf'),
                                                        (2, 'CSS Guide', '/files/css_guide.pdf'),
                                                        (3, 'Data Science Intro', '/files/ds_intro.pdf'),
                                                        (4, 'Python Installation', '/files/python_install.pdf'),
                                                        (5, 'ML Algorithms', '/files/ml_algorithms.pdf');

INSERT INTO schedule (course_id, date, start_time, end_time, room) VALUES
                                                                       (1, '2024-01-10', '09:00:00', '11:00:00', '101'),
                                                                       (1, '2024-01-17', '09:00:00', '11:00:00', '101'),
                                                                       (2, '2024-01-12', '14:00:00', '16:00:00', '202'),
                                                                       (3, '2024-01-15', '10:00:00', '12:00:00', '303'),
                                                                       (4, '2024-01-20', '12:00:00', '14:00:00', '404'),
                                                                       (5, '2024-01-22', '15:00:00', '17:00:00', '505');

INSERT INTO grades (student_id, course_id, grade, comment, date) VALUES
                                                               (4, 1, 85.50, 'Отличный результат', '2024-01-22'),
                                                               (5, 1, 75.00, 'Хорошая работа', '2024-01-23'),
                                                               (6, 2, 90.00, 'Превосходно', '2024-01-25'),
                                                               (7, 3, 65.00, 'Нужно больше практики', '2024-01-27'),
                                                               (8, 4, 88.00, 'Хорошее понимание темы', '2024-02-01'),
                                                               (9, 5, 95.00, 'Превосходная работа', '2024-03-10');

INSERT INTO attendance (student_id, schedule_id, status) VALUES
                                                                   (4, 1, 'Присутствовал'),
                                                                   (5, 1, 'Отсутствовал'),
                                                                  (6, 2, 'Присутствовал'),
                                                                   (7, 3, 'Присутствовал'),
                                                                   (8, 4, 'Присутствовал'),
                                                                   (9, 5, 'Отсутствовал');
