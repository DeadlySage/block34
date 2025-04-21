// imports
const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  createReservation,
  destroyReservation,
} = require("./db");

const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(require("morgan")("dev"));

// app routes
app.get("/", (req, res, next) => {
  res.status(200).json({
    status: 200,
    message: "API is working",
  });
});

app.get("/api/customers", async (req, res, next) => {
  try {
    const response = await fetchCustomers();
    res.status(200).json({
      status: 200,
      data: response,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/restaurants", async (req, res, next) => {
  try {
    const response = await fetchRestaurants();
    res.status(200).json({
      status: 200,
      data: response,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/reservations", async (req, res, next) => {
  try {
    const response = await fetchReservations();
    res.status(200).json({
      status: 200,
      data: response,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/customers/:id/reservations", async (req, res, next) => {
  try {
    // this is customer_id
    const customer_id = req.params.id;

    const restaurant_id = req.body.restaurant_id;
    const date = req.body.date;
    const party_count = req.body.party_count;

    const response = await createReservation(
      date,
      party_count,
      restaurant_id,
      customer_id
    );
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/customers/:customer_id/reservations/:id
app.delete(
  "/api/customers/:customer_id/reservations/:id",
  async (req, res, next) => {
    try {
      const customer_id = req.params.customer_id;
      const reservation_id = req.params.id;

      const response = await destroyReservation(reservation_id, customer_id);
      if (response.rowCount !== 0) {
        res.sendStatus(204);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      next(error);
    }
  }
);

//init function
const init = async () => {
  app.listen(PORT, () => console.log(`listening on port ${PORT}`));
  await client.connect();
};

//run init function
init();
