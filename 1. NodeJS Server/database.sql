create table if not exists Student(
	id varchar(50),
    Recipient varchar(200)  default null,
    constraint primary key PK_Student(id)
);

create table HeaderKeepSession
(
	studentid varchar(50),
	session varchar(200) primary key,
    isKeep boolean not null default true,
    constraint foreign key (studentid) references student(id)
);

create table if not exists Profile(
	StudentID varchar(50),
    Fullname nvarchar(200) not null,
    dob date not null,
    gender nvarchar(10),
    IdCard varchar(20),
    address nvarchar(200),
    phone varchar(20),
    mail varchar(100),
    major varchar(3),
    account_balance nvarchar(50),
    scholarship nvarchar(50),
	constraint primary key PK_Profile(studentID),
    constraint foreign key (studentID) references Student(id)
);

create table if not exists parent(
	studentID varchar(50) primary key,
    fullname nvarchar(200) not null,
    phone varchar(20),
    address nvarchar(200),
    constraint foreign key (studentID) references student(id)
);

create table if not exists subject
(
	id varchar(10) primary key,
    term varchar(10) not null, 
    course varchar(10) not null,
    name nvarchar(200) not null
);

create table if not exists mark
(
	studentID varchar(50) primary key,
    subjectid varchar(10),
    gradeItem nvarchar(50) not null,
    weight float not null,
    value float not null,
    pos integer not null,
    constraint foreign key (studentID) references Student(id),
    constraint foreign key (subjectid) references subject(id)
);

create table if not exists timetable
(
	studentid varchar(50) primary key,
    dayOfWeek integer unique,
    slot integer unique,
    subjectid varchar(10),
    constraint foreign key (studentID) references Student(id),
	constraint foreign key (subjectid) references subject(id)
);

create table attendece
(
	studentid varchar(50) primary key,
    subjectid varchar(10) unique,
    date date not null unique,
    status varchar(20) not null,
    constraint foreign key (subjectid) references subject(id)
);
