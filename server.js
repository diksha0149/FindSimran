const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.set("strictQuery", false);
const homeRouter = require('./routers/homeRouter')
const PORT = process.env.PORT  || 3000
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use('/', homeRouter)

mongoose.connect('mongodb://127.0.0.1:27017/user', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(()=>{
    console.log('mongodb connected')
    app.listen(PORT,()=>{
        console.log(`App is running ${PORT}`)
    })
}).catch(err=>{
    console.log(err)
})






































// const express = require('express')
// const mongoose = require('mongoose')
// const morgan = require('morgan')
// const bodyParser = require('body-parser')

// mongoose.connect('mongodb://localhost:27017/user',{
//     userNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// const db=mongoose.connection

// db.on('error',(err)=>{
//     console.log(err)
// })

// db.once('open',()=>{
//     console.log("Database connected successfully");
// })
// const app=express()

// app.use(morgan('dev'))
// app.use(bodyParser.urlencoded({
//     extended:true
// }))
// app.use(bodyParser.json())

// const PORT = process.env.PORT  || 3000

// app.listen(PORT, ()=>{
//     console.log(`server is running on ${PORT}`);
// })