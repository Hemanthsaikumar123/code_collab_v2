const {getChannel} = require("../rabbitmq");
const {v4: uuidv4} = require("uuid");

const runCode = async (req, res) => {
    try {
    const {language,code} = req.body;
    const channel = getChannel();
    const correlationId = uuidv4();
    const {queue} = await channel.assertQueue(
      "",
      {
        exclusive: true
      }
    );

    channel.consume(queue,(msg) => {
        if (msg.properties.correlationId === correlationId) {
          const result =JSON.parse(
              msg.content.toString()
            );
          res.json(result);
        }
      },
      {
        noAck: true
      }
    );

    channel.sendToQueue(
      "submissions",
      Buffer.from(
        JSON.stringify({language,code})
      ),
      {
        correlationId,
        replyTo: queue
      }
    );

  } 
  catch(error) {
    res.status(500).json({
      error:
        error.message
    });
  }
};

module.exports = {
  runCode
};