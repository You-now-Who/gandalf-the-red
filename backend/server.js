const express = require('express')
const aiWorker = require('./aiWorker')
const app = express()
const port = 3000

// Middleware to parse JSON request bodies
app.use(express.json());

textTos = aiWorker.getTextTos()

app.get('/', (req, res) => {
    // Gets a sample
    (async ()=> {
        const response = await aiWorker.runAI(testTos)
        console.log(response)
        // outputJson = response.output_text.substring(8)
        // outputJson = outputJson.substring(-4)
        outputJson = JSON.parse(response.output_text)
        console.log(outputJson)
        res.send(outputJson)
    })()
})

app.post('/', (req, res) => {
    // Posts a sample
    data = req.body;

    (async ()=> {
        const response = await aiWorker.runAI(data.tosText)
        // console.log(response)
        // outputJson = response.output_text.substring(8)
        // outputJson = outputJson.substring(-4)
        try {
            outputJson = JSON.parse(response.output_text);
            // console.log(outputJson)
            outputJson.url = data.url
            res.send(outputJson);
        } catch (error) {
            console.error(error);
            res.send({error: error})
        }
    })()
})

app.listen(port, () => {
    console.log(`App running and listening on port ${port}`)
})