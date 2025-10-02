import express from 'express'

const app = express() 

app.get('/', (req, res) => {
    res.send('<!doctype html><html><body>Hello Express!</body></html>')
})

app.listen(8000, ()=>console.log('listening 8000')) 