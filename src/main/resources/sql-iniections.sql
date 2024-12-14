ALTER TABLE courses
    DROP FOREIGN KEY fk_courses_users; -- Заменить на реальное имя FK
ALTER TABLE courses
    ADD CONSTRAINT fk_courses_users
        FOREIGN KEY (teacher_id)
            REFERENCES users(id)
            ON DELETE SET NULL;

ALTER TABLE grades
    MODIFY COLUMN date DATE;

ALTER TABLE schedule
    MODIFY COLUMN date DATE;

ALTER TABLE schedule
    MODIFY COLUMN start_time time;

ALTER TABLE schedule
    MODIFY COLUMN end_time time;