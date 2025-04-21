// imports
require('dotenv').config();

const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);

// create department and employee tables
const init = async () => {
  await client.connect();

  const SQL = `
  DROP TABLE IF EXISTS customer CASCADE;
  DROP TABLE IF EXISTS restaurant CASCADE;
  DROP TABLE IF EXISTS reservation CASCADE;

  CREATE TABLE customer(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(80)
  );

  CREATE TABLE restaurant(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(80)
  );

  CREATE TABLE reservation(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    party_count INTEGER NOT NULL,
    restaurant_id UUID REFERENCES restaurant(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
    customer_id UUID REFERENCES customer(id) ON DELETE CASCADE ON UPDATE CASCADE NOT NULL,
    UNIQUE(restaurant_id, customer_id)
  );

  INSERT INTO restaurant(name) VALUES('The Sizzling Spoon');
  INSERT INTO restaurant(name) VALUES('Crimson & Thyme');
  INSERT INTO restaurant(name) VALUES('Taco Tango');
  INSERT INTO restaurant(name) VALUES('Midnight Marinara');
  INSERT INTO restaurant(name) VALUES('Zen Griddle');

  INSERT INTO customer(name) VALUES('Ava Thompson');
  INSERT INTO customer(name) VALUES('Jake Martinez');
  INSERT INTO customer(name) VALUES('Lila Patel');
  INSERT INTO customer(name) VALUES('Ethan Nguyen');
  INSERT INTO customer(name) VALUES('Sofia Ramirez');

  INSERT INTO reservation(date, party_count, restaurant_id, customer_id) 
  VALUES (
    '2025-05-01',
    4,
    (SELECT id FROM restaurant WHERE name = 'The Sizzling Spoon'),
    (SELECT id FROM customer WHERE name = 'Ava Thompson')
    );

  INSERT INTO reservation(date, party_count, restaurant_id, customer_id) 
  VALUES (
    '2025-04-29',
    6,
    (SELECT id FROM restaurant WHERE name = 'The Sizzling Spoon'),
    (SELECT id FROM customer WHERE name = 'Jake Martinez')
    );
  `

  await client.query(SQL);
  console.log("database seeded succesfully")
}

// call init function
init();
