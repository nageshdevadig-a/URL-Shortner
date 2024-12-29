-- Create a new DATABASE for Project 
CREATE DATABASE short_url;

USE short_url;

-- Creating a new tbale to manage urls
CREATE TABLE url(
 urlID BIGINT PRIMARY KEY AUTO_INCREMENT,
 longUrl VARCHAR(1000) NOT NULL, 
 shortUrl VARCHAR(20) NOT NULL UNIQUE, 
 visits INT DEFAULT 0, 
 rel_id BIGINT
);

-- Creating a new table to manage user and url relation
CREATE TABLE user_url(
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 url_id BIGINT NOT NULL,
 user_id BIGINT NOT NULL ,
 created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES home_customuser(userId) ON DELETE CASCADE,
 CONSTRAINT fk_url FOREIGN KEY(url_id) REFERENCES url(urlID) ON DELETE CASCADE
);

-- Adding a foreign key constraint to url table to delete row on delete
ALTER TABLE url ADD CONSTRAINT fk_user_url_rel FOREIGN KEY(rel_id) REFERENCES user_url(id) ON DELETE CASCADE;