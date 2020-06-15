create table appCalls
(
    code             int auto_increment
        primary key,
    ipv4             varchar(15)                           null,
    url              varchar(500)                          null,
    method           varchar(250)                          null,
    registrationDate timestamp default current_timestamp() null
);

create table appCategories
(
    code         int auto_increment
        primary key,
    name         varchar(250) null,
    description  varchar(250) null,
    price        float        null,
    maximumCalls int          null
);

create table postCategories
(
    code        int auto_increment
        primary key,
    name        varchar(250) null,
    description varchar(250) null
);

create table status
(
    code        int auto_increment
        primary key,
    name        varchar(250) null,
    description varchar(250) null
);

create table apps
(
    code             int auto_increment
        primary key,
    userCode         int                                                    null,
    statusCode       int                                                    null,
    visibility       enum ('public', 'private') default 'public'            null,
    token            varchar(250)                                           null,
    categoryCode     int                                                    null,
    name             varchar(250)                                           null,
    description      varchar(250)                                           null,
    imageURL         varchar(250)                                           null,
    registrationDate timestamp                  default current_timestamp() null,
    lastUpdate       timestamp                  default current_timestamp() null,
    constraint apps_appCategories_code_fk
        foreign key (categoryCode) references appCategories (code)
            on update cascade on delete cascade,
    constraint apps_status_code_fk
        foreign key (statusCode) references status (code)
            on update cascade on delete cascade
);

create table apiCalls
(
    code             int auto_increment
        primary key,
    appCode          int                                   null,
    ipv4             varchar(15)                           null,
    url              varchar(500)                          null,
    method           varchar(250)                          null,
    registrationDate timestamp default current_timestamp() null,
    constraint apiCalls_apps_code_fk
        foreign key (appCode) references apps (code)
            on update cascade on delete cascade
);

create table userCategories
(
    code        int auto_increment
        primary key,
    name        varchar(250)  null,
    description varchar(250)  null,
    price       float         null,
    maximumApps int default 1 null
);

create table users
(
    code             int auto_increment
        primary key,
    appCode          int                                                      null,
    statusCode       int                                                      null,
    visibility       enum ('public', 'private') default 'public'              null,
    diff             int                        default 1                     null,
    user             varchar(250)                                             not null,
    password         varchar(250)                                             not null,
    email            varchar(250)                                             not null,
    categoryCode     int                                                      null,
    name             varchar(250)                                             not null,
    surname          varchar(250)                                             not null,
    registrationDate timestamp                  default current_timestamp()   not null,
    lastUpdate       timestamp                  default current_timestamp()   null,
    birthDate        timestamp                  default '1971-01-01 00:00:00' not null,
    imageURL         varchar(250)                                             null,
    recoverURLCode   varchar(250)                                             null,
    recoverCode      varchar(250)                                             null,
    constraint users_apps_code_fk
        foreign key (appCode) references apps (code),
    constraint users_status_code_fk
        foreign key (statusCode) references status (code)
            on update cascade on delete cascade,
    constraint users_userCategories_code_fk
        foreign key (categoryCode) references userCategories (code)
            on update cascade on delete cascade
);

create table applications
(
    code             int auto_increment
        primary key,
    userCode         int                                   not null,
    category         varchar(250)                          not null,
    app              varchar(250)                          not null,
    registrationDate timestamp default current_timestamp() null,
    lastUpdate       timestamp default current_timestamp() null,
    constraint applications_users_code_fk
        foreign key (userCode) references users (code)
            on update cascade on delete cascade
);

alter table apps
    add constraint apps_users_code_fk
        foreign key (userCode) references users (code);

create table posts
(
    code             int auto_increment
        primary key,
    userCode         int                                   null,
    title            text                                  null,
    body             text                                  null,
    registrationDate timestamp default current_timestamp() null,
    categoryCode     int                                   null,
    constraint posts_postCategories_code_fk
        foreign key (categoryCode) references postCategories (code)
            on update cascade on delete cascade,
    constraint posts_users_code_fk
        foreign key (userCode) references users (code)
            on update cascade on delete cascade
);

create table sessionLogs
(
    code             int auto_increment
        primary key,
    userCode         int                                   not null,
    registrationDate timestamp default current_timestamp() not null on update current_timestamp(),
    type             varchar(250)                          null,
    device           varchar(250)                          not null,
    constraint sessionLogs_users_code_fk
        foreign key (userCode) references users (code)
            on update cascade on delete cascade
);

create table trackerLogs
(
    code            int auto_increment
        primary key,
    userCode        int                                     not null,
    applicationCode int                                     not null,
    start           timestamp default '0000-00-00 00:00:00' not null on update current_timestamp(),
    stop            timestamp default '0000-00-00 00:00:00' not null,
    duration        int                                     not null,
    constraint trackerLogs_applications_code_fk
        foreign key (applicationCode) references applications (code)
            on update cascade on delete cascade,
    constraint trackerLogs_users_code_fk
        foreign key (userCode) references users (code)
            on update cascade on delete cascade
);


