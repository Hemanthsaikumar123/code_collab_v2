require("dotenv").config();
const express = require("express");
const {connectRabbitMQ} = require("./rabbitmq");
const runnerRoutes = require("./routes/runnerRoutes");
const app = express();

app.use(express.json());
app.use("/api/run", runnerRoutes);

async function startServer() {
  try {
    await connectRabbitMQ();
    const port = process.env.PORT || 5003;
    app.listen(port,() => {
        console.log("Runner Service running");
      }
    );
  } 
  catch(error) {
    console.error(error);
  }
}
startServer();