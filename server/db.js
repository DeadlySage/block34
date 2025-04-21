// imports
require("dotenv").config();

const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);

// database functions
const createTables = async () => {
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
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const createCustomer = async (name) => {
  const SQL = `
    INSERT INTO customer(name) 
    VALUES($1)
    RETURNING *;
  `;
  const response = await client.query(SQL, [name]);
  return response.rows;
};

const createRestaurant = async (name) => {
  const SQL = `
    INSERT INTO restaurant(name) 
    VALUES($1)
    RETURNING *;
  `;
  const response = await client.query(SQL, [name]);
  return response.rows;
};

const fetchCustomers = async () => {
  const SQL = `
    SELECT * FROM customer;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchRestaurants = async () => {
  const SQL = `
    SELECT * FROM restaurant;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchReservations = async () => {
  const SQL = `
    SELECT * FROM reservation;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const createReservation = async (
  date,
  party_count,
  restaurant_id,
  customer_id
) => {
  const SQL = `
    INSERT INTO reservation(date, party_count, restaurant_id, customer_id) 
    VALUES ($1, $2, $3, $4);
  `;
  const response = await client.query(SQL, [
    date,
    party_count,
    restaurant_id,
    customer_id,
  ]);
  return response.rows;
};

const destroyReservation = async (reservation_id, customer_id) => {
  const SQL = `
    DELETE FROM reservation 
    WHERE id = $1 
    AND customer_id = $2;
  `;
  const response = await client.query(SQL, [reservation_id, customer_id]);
  return response;
};

// exports
module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  createReservation,
  destroyReservation,
};
