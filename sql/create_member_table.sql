

create table Member (
	ID serial primary key,
	FirstName text not null,
	LastName text not null,
	Email text not null unique,
	Password text not null
)
	
	