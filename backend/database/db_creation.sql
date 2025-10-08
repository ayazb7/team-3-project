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

create table users (
	id int primary key auto_increment,
    username varchar(100) not null,
    email varchar(100) unique not null,
    password_hash varchar(255) not null,
    language_preference varchar(50),
    created_at datetime default current_timestamp
);

create table tutorials (
	id int primary key auto_increment,
    title varchar(255) not null,
    description text,
    video_url varchar(255),
    category varchar(100) not null,
    created_at datetime default current_timestamp
);

create table courses (
    id int primary key auto_increment,
    name varchar(255) not null,
    description text,
    course_type varchar(100) not null,
    created_at datetime default current_timestamp
);

create table course_tutorials (
    course_id int not null,
    tutorial_id int not null,
    primary key (course_id, tutorial_id),
    foreign key (course_id) references courses(id),
    foreign key (tutorial_id) references tutorials(id)
);

create table user_tutorial_progress (
    id int primary key auto_increment,
    user_id int not null,
    tutorial_id int not null,
    completed boolean default false,
    completed_at datetime,
    foreign key (user_id) references users(id),
    foreign key (tutorial_id) references tutorials(id)
);

create table user_course_progress (
    id int primary key auto_increment,
    user_id int not null,
    course_id int not null,
    progress_percentage decimal(5,2) not null, 
    last_updated datetime default current_timestamp,
    foreign key (user_id) references users(id),
    foreign key (course_id) references courses(id)
);

create table quizzes (
    id int primary key auto_increment,
    tutorial_id int not null,
    question text not null,
    correct_answer text not null,
    foreign key (tutorial_id) references tutorials(id)
);

create table user_quiz_results (
    id int primary key auto_increment,
    user_id int not null,
    quiz_id int not null,
    user_answer text not null,
    is_correct boolean not null,
    attempted_at datetime not null,
    foreign key (user_id) references users(id),
    foreign key (quiz_id) references quizzes(id)
);

create table admin_logs (
    id int primary key auto_increment,
    user_id int not null,
    action text not null,
    timestamp datetime default current_timestamp,
    foreign key (user_id) references users(id)
    );
 
create table web_traffic (
    id int primary key auto_increment,
    user_id int not null,
    page_url varchar(255) not null,
    interaction_type varchar(100) not null,
    timestamp datetime default current_timestamp,
    foreign key (user_id) references users(id)
);
