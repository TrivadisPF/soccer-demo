drop table [football_db].[player];
drop table [football_db].[playerPosition];
drop table [football_db].[playerMetric];
drop table [football_db].[bodyType];
drop table [football_db].[tag];
drop table [football_db].[playerTag];
drop table [football_db].[nationality];
drop table [football_db].[clubTeam];
drop table [football_db].[nationalTeam];
drop table [football_db].[playerClubTeam];
drop table [football_db].[playerNationalTeam];

CREATE TABLE [football_db].player (
	id int not null, 
	name NVARCHAR(100), 
	full_name NVARCHAR(100), 
	birth_date DATE, 
	age int,
	height_cm DECIMAL(18,3),
	weight_kgs DECIMAL(18,3),
	nationality_id int,
	overall_rating int,
	potential int,
	value_euro DECIMAL(18,3),
	wage_euro DECIMAL(18,3),
	preferred_foot NVARCHAR(100),
	international_reputation int,
	weak_foot int,
	skill_moves int,
	work_rate NVARCHAR(100),
	body_type_id int,
	release_clause_euro DECIMAL(18,3),
	last_update TIMESTAMP
);

ALTER TABLE [football_db].player ADD CONSTRAINT player_pk PRIMARY KEY (id);

CREATE TABLE [football_db].playerPosition (player_id int not null
						, p_index int  not null
						, position NVARCHAR(3));

ALTER TABLE [football_db].playerPosition ADD CONSTRAINT player_position_pk PRIMARY KEY (player_id, p_index);						

CREATE TABLE [football_db].playerMetric (player_id int  not null
								, crossing int
								, finishing int
								, heading_accuracy int
								, short_passing int
								, volleys int
								, dribbling int
								, curve int
								, freekick_accuracy int
								, long_passing int
								, ball_control int
								, acceleration int
								, sprint_speed int
								, agility int
								, reactions int
								, balance int
								, shot_power int
								, jumping int
								, stamina int
								, strength int
								, long_shots int
								, aggression int
								, interceptions int
								, positioning int
								, vision int
								, penalties int
								, composure int
								, marking int
								, standing_tackle int
								, sliding_tackle int
								, GK_diving int
								, GK_handling int
								, GK_kicking int
								, GK_positioning int
								, GK_reflexes int);

ALTER TABLE [football_db].playerMetric ADD CONSTRAINT player_metric_pk PRIMARY KEY (player_id);


CREATE TABLE [football_db].bodyType (id int not null,
						name NVARCHAR(100));

ALTER TABLE [football_db].bodyType ADD CONSTRAINT body_type_pk PRIMARY KEY (id);
						
CREATE TABLE [football_db].tag (id int not null,
						name NVARCHAR(100));

ALTER TABLE [football_db].tag ADD CONSTRAINT tag_pk PRIMARY KEY (id);

CREATE TABLE [football_db].playerTag (player_id int not null,
						tag_id int not null);

ALTER TABLE [football_db].playerTag ADD CONSTRAINT pla_tag_pk PRIMARY KEY (player_id, tag_id);

CREATE TABLE [football_db].nationality (id int not null,
							name NVARCHAR(100)); 

ALTER TABLE [football_db].nationality ADD CONSTRAINT nationality_pk PRIMARY KEY (id);
									
CREATE TABLE [football_db].clubTeam (id int not null
							, name NVARCHAR(100)
							, rating DECIMAL(18,3));

ALTER TABLE [football_db].clubTeam ADD CONSTRAINT club_team_pk PRIMARY KEY (id);
							
CREATE TABLE [football_db].nationalTeam (id int not null
							, name NVARCHAR(100)
							, rating DECIMAL(18,3)); 

ALTER TABLE [football_db].nationalTeam ADD CONSTRAINT national_team_pk PRIMARY KEY (id);
																					 							
CREATE TABLE [football_db].playerClubTeam (player_id int not null
									, club_team_id int not null
									, club_position NVARCHAR(100)
									, club_jersey_number NVARCHAR(100)
									, club_join_date NVARCHAR(100)
									, contract_end_year NVARCHAR(100)
									);

ALTER TABLE [football_db].playerClubTeam ADD CONSTRAINT pla_clut_pk PRIMARY KEY (player_id, club_team_id);


CREATE TABLE [football_db].playerNationalTeam (player_id int not null
									, national_team_id int not null
									, national_team_position NVARCHAR(100)
									, nataionl_jersey_number NVARCHAR(100)
									);

ALTER TABLE [football_db].playerNationalTeam ADD CONSTRAINT pla_natt_pk PRIMARY KEY (player_id, national_team_id);


																					 							