const amqp = require("amqplib");
const util = require("util");
const crypto = require("crypto");
const fs = require("fs/promises");
const { exec } = require("child_process");
const execPromise = util.promisify(exec);


async function connectRabbitMQ() {

  while (true) {

    try {
      const connection = await amqp.connect("amqp://rabbitmq");
      console.log("RabbitMQ Connected");
      return connection;
    } catch (err) {
      console.log("RabbitMQ not ready. Retrying in 5 seconds...");

      await new Promise(resolve =>
        setTimeout(resolve, 5000)
      );
    }
  }
}

async function startWorker() {

    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();

    await channel.assertQueue("submissions");
    const workerId =Math.random().toString(36).substring(2, 8);
    console.log(`Worker ${workerId} started`);

    channel.consume("submissions", async (msg) => {

        if (!msg) return;

        let filename;

        try {
        const { language,code } = JSON.parse(msg.content.toString());
        const fileId = crypto.randomUUID();

        let extension;
        switch(language) {
        case "python":
            extension = "py";
            break;

        case "javascript":
            extension = "js";
            break;

        case "java":
            extension = "java";
            break;

        default:
            throw new Error("Unsupported language");
        }

        if(language === "java") {
        filename = "/sandbox/Main.java";
        }
        else {
        filename = `/sandbox/${fileId}.${extension}`;
        }

        await fs.writeFile(filename,code);

        let image;
        let command;
        switch(language) {
        case "python":
            image = "python:3.12-alpine";
            command = `python ${filename}`;
            break;

        case "javascript":
            image = "node:22-alpine";
            command = `node ${filename}`;
            break;

        case "java":
            image = "eclipse-temurin:21-jdk";
            command = `sh -c "javac ${filename} && java -cp /sandbox Main"`;
            break;
        }

        const {stdout,stderr}= await execPromise(
                `
                docker run --rm \
                --memory=128m \
                --cpus=0.5 \
                --network=none \
                -v ${process.env.EXECUTION_VOLUME}:/sandbox \
                ${image} \
                ${command}
                `,
                {
                timeout: 5000
                }
        );

        const output = stdout || stderr || "";

        channel.sendToQueue(msg.properties.replyTo,
        Buffer.from(
            JSON.stringify({
            output,
            error: false
            })
        ),
        {
            correlationId:msg.properties.correlationId
        }
        );
        }
        catch(error) {
        const output = error?.stderr || error?.stdout || error?.message || "Execution failed";

        if (msg.properties.replyTo) {
            channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(
                JSON.stringify({
                output,
                error: true
                })
            ),
            {
                correlationId: msg.properties.correlationId
            }
            );
        }

        console.error("Worker execution failed:", output);
        }
        finally {
        if (filename) {
            try {
            await fs.unlink(filename);
            }
            catch (cleanupError) {
            console.error("Failed to clean up sandbox file:", cleanupError.message);
            }
        }

        channel.ack(msg);
        }

    });
}

startWorker()
