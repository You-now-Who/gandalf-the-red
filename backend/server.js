const express = require('express')
const aiWorker = require('./aiWorker')
const app = express()
const port = 3000

// Middleware to parse JSON request bodies
app.use(express.json());

app.get('/', (req, res) => {
    (async ()=> {
        const response = await aiWorker.runAI()
        console.log(response)
        res.send(response.output_text)
    })()
})

app.post('/', (req, res) => {
    res.send(req.body)
})

app.listen(port, () => {
    console.log(`App running and listening on port ${port}`)
})