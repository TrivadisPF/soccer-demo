CREATE SCHEMA IF NOT EXISTS football_db;

SET search_path TO football_db;

DROP TABLE IF EXISTS player_t;

CREATE TABLE player_t (id BIGINT, 
					name CHARACTER VARYING(100), 
					full_name CHARACTER VARYING(100), 
					birth_date DATE, 
					age INTEGER,
					height_cm DOUBLE,
					weight_kgs DOUBLE
					nationality_id INGEGER,
					overall_rating INTEGER
					potential INTEGER,
					value_euro DOUBLE,
					wage_euro DOUBLE,
					preferred_foot CHARACTER VARYING(100),
					international_reputation INTEGER,
					weak_foot INTEGER,
					skill_moves INTEGER,
					work_rate CHARACTER VARYING(100),
					body_type_id INTEGER,
					release_clause_euro DOUBLE,
					last_update TIMESTAMP);

ALTER TABLE player_t ADD CONSTRAINT player_pk PRIMARY KEY (id);


CREATE TABLE player_postion_t (player_id BIGINT
						, position CHARACTER VARYING(3)
						, index INTEGER );
ALTER TABLE player_position_t ADD CONSTRAINT player_position_pk PRIMARY KEY (player_id, index));						


CREATE TABLE player_metric_t (player_id BIGINT 
								, crossing INTEGER
								, finishing INTEGER
								, heading_accuracy INTEGER
								, short_passing INTEGER
								, volleys INTEGER
								, dribbling INTEGER
								, curve INTEGER
								, freekick_accuracy INTEGER
								, long_passing INTEGER
								, ball_control INTEGER
								, acceleration INTEGER
								, sprint_speed INTEGER
								, agility INTEGER
								, reactions INTEGER
								, balance INTEGER
								, shot_power INTEGER
								, jumping INTEGER
								, stamina INTEGER
								, strength INTEGER
								, long_shots INTEGER
								, aggression INTEGER
								, interceptions INTEGER
								, positioning INTEGER
								, vision INTEGER
								, penalties INTEGER
								, composure INTEGER
								, marking INTEGER
								, standing_tackle INTEGER
								, sliding_tackle INTEGER
								, GK_diving INTEGER
								, GK_handling INTEGER
								, GK_kicking INTEGER
								, GK_positioning INTEGER
								, GK_reflexes INTEGER);
ALTER TABLE player_metric_t ADD CONSTRAINT player_metric_pk PRIMARY KEY (player_id);


CREATE TABLE body_type_t (id BIGINT
						name CHARACTER VARYING(100));
ALTER TABLE body_type_t ADD CONSTRAINT body_type_pk PRIMARY KEY (id);
						
CREATE TABLE tag_t (id BIGINT
						name CHARACTER VARYING(100));
ALTER TABLE tag_t ADD CONSTRAINT tag_pk PRIMARY KEY (id);

CREATE TABLE pla_tag_t (player_id BIGINT
						tag_id BIGINT);
ALTER TABLE pla_tag_t ADD CONSTRAINT pla_tag_pk PRIMARY KEY (player_id, tag_id);

CREATE TABLE nationality_t (id INTEGER,
							name CHARACTER VARYING(100)); 
ALTER TABLE nationality_t ADD CONSTRAINT nationality_pk PRIMARY KEY (id);
									
CREATE TABLE club_team_t (id BIGINT
							, name CHARACTER VARYING(100)
							, rating DOUBLE);
ALTER TABLE club_team_t ADD CONSTRAINT club_team_pk PRIMARY KEY (id);
							
CREATE TABLE national_team_t (id BIGINT
							, name CHARACTER VARYING(100)
							, rating DOUBLE)); 
ALTER TABLE national_team_t ADD CONSTRAINT national_team_pk PRIMARY KEY (id);
																					 							
CREATE TABLE pla_clut_t (player_id BIGINT
									, club_team_id BIGINT
									, club_position BIGING
									, club_jersey_number CHARACTER VARYING(100)
									, club_join_date DATE
									, contract_end_year INTEGER
									);
ALTER TABLE pla_clut_t ADD CONSTRAINT pla_clut_pk PRIMARY KEY (player_id, club_team_id);


CREATE TABLE pla_natt_t (player_id BIGINT
									, national_team_id BIGINT
									, national_team_position BIGING
									, nataionl_jersey_number CHARACTER VARYING(100)
									);
ALTER TABLE pla_natt_t ADD CONSTRAINT pla_natt_pk PRIMARY KEY (player_id, national_team_id);


																					 							