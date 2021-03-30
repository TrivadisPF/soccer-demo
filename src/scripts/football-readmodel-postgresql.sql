CREATE SCHEMA IF NOT EXISTS football_db;

SET search_path TO football_db;

DROP TABLE IF EXISTS player_t;

CREATE TABLE player_t (id BIGINT, 
					name CHARACTER VARYING(100), 
					full_name CHARACTER VARYING(100), 
					age INTEGER,
					height_cm DECIMAL,
					weight_kgs DECIMAL,
					nationality_id BIGINT,
					overall_rating INTEGER,
					potential INTEGER,
					value_euro DECIMAL,
					wage_euro DECIMAL,
					preferred_foot CHARACTER VARYING(100),
					international_reputation INTEGER,
					weak_foot INTEGER,
					skill_moves INTEGER,
					work_rate CHARACTER VARYING(100),
					body_type_id BIGINT,
					release_clause_euro DECIMAL);

ALTER TABLE player_t ADD CONSTRAINT player_pk PRIMARY KEY (id);

CREATE TABLE team_t (id BIGINT,
 					name CHARACTER VARYING(100),
 					rating DECIMAL
 					);
ALTER TABLE team_t ADD CONSTRAINT team_pk PRIMARY KEY (id);
 					
 					
CREATE TABLE game_t (id BIGINT,
					at DATE,
					start_time CHARACTER VARYING(100),
					stadium_id BIGINT,
					home_team_id BIGINT,
					away_team_id BIGINT);
ALTER TABLE game_t ADD CONSTRAINT game_pk PRIMARY KEY (id);


CREATE TABLE lineup_t (player_id BIGINT,
					game_id BIGINT,
					team CHARACTER VARYING (50),
					team_id BIGINT,
					sensor_id BIGINT NULL,
					position CHARACTER VARYING(3) NULL);
ALTER TABLE lineup_t ADD CONSTRAINT lineup_pk PRIMARY KEY (player_id, game_id);


// to be done


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




																					 							