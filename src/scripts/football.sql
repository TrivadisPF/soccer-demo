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
					body_type_id INTEGER,
					last_update TIMESTAMP);

ALTER TABLE player_t ADD CONSTRAINT player_pk PRIMARY KEY (id);

ALTER TABLE player_t ADD CONSTRAINT player_

CREATE TABLE player_postion_t (player_id BIGINT
						, position CHARACTER VARYING(3)
						, index INTEGER );


CREATE TABLE player_2_clubteam_t (player_id BIGINT
									, club_team_id BIGINT
									, club_position BIGING
									, club_jersey_number CHARACTER VARYING(100)
									, club_join_date DATE
									, contract_end_year INTEGER
									);


CREATE TABLE player_2_clubteam_t (player_id BIGINT
									, club_team_id BIGINT
									, club_position BIGING
									, club_jersey_number CHARACTER VARYING(100)
									, club_join_date DATE
									, contract_end_year INTEGER
									);



CREATE TABLE body_type_t (id BIGINT
						name CHARACTER VARYING(100));

CREATE TABLE nationality_t (id INTEGER,
							name CHARACTER VARYING(100)); 
							
							
CREATE TABLE club_team_t (id BIGINT
							, name CHARACTER VARYING(100)
							, rating DOUBLE);
							
CREATE TABLE national_team (id INTEGER
							, name CHARACTER VARYING(100)
							, rating DOUBLE)); 														 							