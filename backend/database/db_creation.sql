create schema skywise_db;
use skywise_db;

create table users (
	id int primary key auto_increment,
    name varchar(100),
    email varchar(100) unique,
    password_hash varchar(255),
    language_preference varchar(50),
    created_at datetime default current_timestamp
);

create table tutorials (
	id int primary key auto_increment,
    title varchar(255),
    description text,
    video_url varchar(255),
    category varchar(100),
    created_at datetime default current_timestamp
);

create table courses (
    id int primary key auto_increment,
    name varchar(255),
    description text,
    course_type varchar(100),
    created_at datetime default current_timestamp
);

create table course_tutorials (
    course_id int,
    tutorial_id int,
    primary key (course_id, tutorial_id),
    foreign key (course_id) references courses(id),
    foreign key (tutorial_id) references tutorials(id)
);

create table user_tutorial_progress (
    id int primary key auto_increment,
    user_id int,
    tutorial_id int,
    completed boolean default false,
    completed_at datetime,
    foreign key (user_id) references users(id),
    foreign key (tutorial_id) references tutorials(id)
);

create table user_course_progress (
    id int primary key auto_increment,
    user_id int,
    course_id int,
    progress_percentage decimal(5,2), 
    last_updated datetime default current_timestamp,
    foreign key (user_id) references users(id),
    foreign key (course_id) references courses(id)
);

create table quizzes (
    id int primary key auto_increment,
    tutorial_id int,
    question text,
    correct_answer text,
    foreign key (tutorial_id) references tutorials(id)
);

create table user_quiz_results (
    id int primary key auto_increment,
    user_id int,
    quiz_id int,
    user_answer text,
    is_correct boolean,
    attempted_at datetime,
    foreign key (user_id) references users(id),
    foreign key (quiz_id) references quizzes
);

create table admin_logs (
    id int primary key auto_increment,
    user_id int,
    action text,
    timestamp datetime default current_timestamp,
    foreign key (user_id) references users(id)
    );
 
create table web_traffic (
    id int primary key auto_increment,
    user_id int,
    page_url varchar(255),
    interaction_type varchar (100),
    timestamp datetime default current_timestamp,
    foreign key (user_id) references users(id)
);


