CREATE TABLE person (
    person_id integer IDENTITY,
    client_id integer DEFAULT -1,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    email_address varchar(50) NOT NULL UNIQUE,
    street_address varchar(50) NOT NULL,
    city varchar(50) NOT NULL,
    state varchar(2) NOT NULL,
    zip_code varchar(5) NOT NULL
);

CREATE TABLE client(
    client_id integer IDENTITY,
    client_name varchar(50) NOT NULL,
    client_phone varchar(15) NOT NULL UNIQUE,
    client_uri varchar(50) NOT NULL UNIQUE,
    street_address varchar(50) NOT NULL,
    city varchar(50) NOT NULL,
    state varchar(2) NOT NULL,
    zip_code varchar(5) NOT NULL
);