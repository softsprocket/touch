
create table Site (
	Domain text not null,
	MemberID integer not null,
	Role text not null,
	constraint site_pk primary key(Domain, MemberID)
)