import e from 'express'
import express from 'express'

const app = express() 

// app.use((req, res, next)=>{
//     console.log('middleware')
//     next()
// })

// app.use((req, res, next)=>{
//     console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
//     next()
// })

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send('<!doctype html><html><body>Hello Express!</body></html>')
})

app.listen(8000, ()=>console.log('listening 8000')) 