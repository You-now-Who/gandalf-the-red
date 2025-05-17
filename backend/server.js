const express = require('express')
const app = express()
const port = 3000

// Middleware to parse JSON request bodies
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello, World!")
})

app.post('/', (req, res) => {
    res.send(req.body)
})

app.listen(port, () => {
    console.log(`App running and listening on port ${port}`)
})