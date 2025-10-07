-- =============================================================
--  SKYWISE DATABASE SCHEMA
--  Project Group: Flow State (Team 3)
-- =============================================================

create schema if not exists skywise_db;
use skywise_db;

drop table if exists web_traffic;
drop table if exists admin_logs;
drop table if exists user_quiz_results;
drop table if exists user_course_progress;
drop table if exists user_tutorial_progress;
drop table if exists course_tutorials;
drop table if exists quizzes;
drop table if exists tutorials;
drop table if exists courses;
drop table if exists users;

-- =============================================================
--  TABLE: USERS
-- =============================================================

create table users (
	id int primary key auto_increment,
    username varchar(100) not null,
    email varchar(100) unique not null,
    password_hash varchar(255) not null,
    language_preference varchar(50),
    created_at datetime default current_timestamp
);

-- =============================================================
--  TABLE: TUTORIALS
-- =============================================================

create table tutorials (
	id int primary key auto_increment,
    title varchar(255) not null,
    description text,
    video_url varchar(255),
    category varchar(100) not null,
    created_at datetime default current_timestamp
);

-- =============================================================
--  TABLE: COURSES
-- =============================================================

create table courses (
    id int primary key auto_increment,
    name varchar(255) not null,
    description text,
    course_type varchar(100) not null,
    created_at datetime default current_timestamp
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
    foreign key (user_id) references users(id),
    foreign key (tutorial_id) references tutorials(id)
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
    foreign key (course_id) references courses(id)
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
