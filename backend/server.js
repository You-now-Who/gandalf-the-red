const express = requrire('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send("Hello, World!")
})

app.listen(port, () => {
    console.log(`App running and listening on port ${port}`)
})