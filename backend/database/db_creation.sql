-- =============================================================
--  SKYWISE DATABASE SCHEMA
--  Project Group: Flow State (Team 3)
-- =============================================================

create schema if not exists skywise_db;
use skywise_db;

DROP TABLE IF EXISTS web_traffic;
DROP TABLE IF EXISTS admin_logs;
DROP TABLE IF EXISTS user_quiz_answers;
DROP TABLE IF EXISTS user_quiz_results;
DROP TABLE IF EXISTS user_course_progress;
DROP TABLE IF EXISTS user_tutorial_progress;
DROP TABLE IF EXISTS course_tutorials;
DROP TABLE IF EXISTS quiz_options;
DROP TABLE IF EXISTS quiz_questions;
DROP TABLE IF EXISTS quizzes;
DROP TABLE IF EXISTS tutorials;
DROP TABLE IF EXISTS course_requirements;
DROP TABLE IF EXISTS course_prerequisites;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

-- =============================================================
--  TABLE: USERS
-- =============================================================

create table users (
	id int primary key auto_increment,
    username varchar(100) not null,
    email varchar(100) unique not null,
    password_hash varchar(255) not null,
    language_preference varchar(50) default 'English',
    created_at datetime default current_timestamp
);

-- =============================================================
--  TABLE: TUTORIALS
-- =============================================================

CREATE TABLE tutorials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    video_provider ENUM('synthesia', 'youtube') DEFAULT 'synthesia',
    video_url VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    video_transcript text
);

-- =============================================================
--  TABLE: COURSES
-- =============================================================

CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Beginner',
    summary TEXT,
    learning_objectives JSON,
    duration_min_minutes INT,
    duration_max_minutes INT,
    thumbnail_url VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE course_prerequisites (
    course_id INT NOT NULL,
    prerequisite_course_id INT NOT NULL,
    PRIMARY KEY (course_id, prerequisite_course_id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (prerequisite_course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE course_requirements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    requirement_text VARCHAR(255) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- =============================================================
--  TABLE: COURSE_TUTORIALS (Many-to-Many)
-- =============================================================

create table course_tutorials (
    course_id int not null,
    tutorial_id int not null,
    primary key (course_id, tutorial_id),
    foreign key (course_id) references courses(id),
    foreign key (tutorial_id) references tutorials(id)
);

-- -------------------------------------------------------------
-- Indexes for faster joins
-- -------------------------------------------------------------
create index idx_course_id    ON course_tutorials(course_id);
create index idx_tutorial_id  ON course_tutorials(tutorial_id);

-- =============================================================
--  TABLE: USER_TUTORIAL_PROGRESS
-- =============================================================

create table user_tutorial_progress (
    id int primary key auto_increment,
    user_id int not null,
    tutorial_id int not null,
    completed boolean default false,
    completed_at datetime,
    feedback ENUM('positive', 'negative') DEFAULT NULL,
    foreign key (user_id) references users(id),
    foreign key (tutorial_id) references tutorials(id),
    unique key unique_user_tutorial (user_id, tutorial_id)
);


-- =============================================================
--  TABLE: USER_COURSE_PROGRESS
-- =============================================================

create table user_course_progress (
    id int primary key auto_increment,
    user_id int not null,
    course_id int not null,
    progress_percentage decimal(5,2) not null,
    last_updated datetime default current_timestamp,
    foreign key (user_id) references users(id),
    foreign key (course_id) references courses(id),
    unique key unique_user_course (user_id, course_id)
);

-- =============================================================
--  QUIZ STRUCTURE 
-- =============================================================

-- ------------------------------
-- TABLE: QUIZZES
-- ------------------------------

create table quizzes (
    id int primary key auto_increment,
    tutorial_id int not null,
    title varchar(255) not null,
    created_at datetime default current_timestamp,
    foreign key (tutorial_id) references tutorials(id) on delete cascade
);

-- Index for quiz lookup by tutorial
create index idx_tutorial_id_quizzes ON quizzes(tutorial_id);

-- ------------------------------
-- TABLE: QUIZ_QUESTIONS
-- ------------------------------

create table quiz_questions (
    id int primary key auto_increment,
    quiz_id int not null,
    question_text text not null,
    question_order int,
    points decimal(5,2) default 1.00,
    created_at datetime default current_timestamp,
    foreign key (quiz_id) references quizzes(id) on delete cascade
);

-- Index for quiz details
create index idx_quiz_id ON quiz_questions(quiz_id);

-- ------------------------------
-- TABLE: QUIZ_OPTIONS
-- ------------------------------

create table quiz_options (
    id int primary key auto_increment,
    question_id int not null,
    option_text text not null,
    is_correct boolean default false,
    created_at datetime default current_timestamp,
    foreign key (question_id) references quiz_questions(id) on delete cascade
);

-- Index for question lookup
CREATE INDEX idx_question_id ON quiz_options(question_id);

-- ------------------------------
-- TABLE: USER_QUIZ_RESULTS
-- ------------------------------

create table user_quiz_results (
    id int primary key auto_increment,
    user_id int not null,
    quiz_id int not null,
    score decimal(5,2),
    total_questions int,
    correct_answers int,
    attempted_at datetime default current_timestamp,
    foreign key (user_id) references users(id) on delete cascade,
    foreign key (quiz_id) references quizzes(id) on delete cascade
);

-- ------------------------------
-- TABLE: USER_QUIZ_ANSWERS
-- ------------------------------

create table user_quiz_answers (
    id int primary key auto_increment,
    user_quiz_result_id int not null,
    question_id int not null,
    selected_option_id int,
    is_correct boolean,
    foreign key (user_quiz_result_id) references user_quiz_results(id) on delete cascade,
    foreign key (question_id) references quiz_questions(id) on delete cascade,
    foreign key (selected_option_id) references quiz_options(id) on delete cascade
);

-- =============================================================
--  TABLE: ADMIN_LOGS
-- =============================================================

create table admin_logs (
    id int primary key auto_increment,
    user_id int not null,
    action text not null,
    created_at datetime default current_timestamp,
    foreign key (user_id) references users(id)
);

-- =============================================================
--  TABLE: WEB_TRAFFIC
-- =============================================================

create table web_traffic (
    id int primary key auto_increment,
    user_id int not null,
    page_url varchar(255) not null,
    interaction_type varchar(100) not null,
    created_at datetime default current_timestamp,
    foreign key (user_id) references users(id)
);


-- =============================================================
--  TABLE: COURSE_EMBEDDING
-- =============================================================

create table course_embedding (
	id int primary key auto_increment,
    course_id int,
    embed_text text,
    embedding JSON
)