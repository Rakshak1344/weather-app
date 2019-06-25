const chalk = require('chalk')
const express = require('express')
const path = require('path')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const port = process.env.PORT || 3000

const app = express()
//define path for expess config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirPath))

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Rakshith'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help Me',
        name: 'Rakshith',
        phno: '[masked]',
        address: '[Masked]'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Rakshith',
        designation: 'App-Developer'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'No address found'
        })
    }
    geocode(req.query.address , (error, {latitude,longitude,location}={})=>{
        if(error){
            return res.send({ error: 'You must provide an address' })
        }
        forecast(latitude ,longitude, (error , forecastData)=>{
            if(error){
                return res.send({error})
            }
            res.send({
                forecast : forecastData.forecast,
                location,
                address: req.query.address,
                windspeed : forecastData.windspeed,
                timezone: forecastData.timezone
            })
        })
    })
})

app.get('/products',(req,res)=>{
    if(!req.query.search){
       res.send({
           error: 'You mush provide serach term'
       }) 
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*',(req,res)=>{
    res.render('404',{
        title: '404',
        name: 'Rakshith',
        errorMsg: 'Help artical not found'
    })
})

//wildcard character *
app.get('*', (req, res) => {
    res.render('404',{
        title: '404',
        name: 'Rakshith',
        errorMsg: 'Page Not found'
    })
})
app.listen(port, () => {
    console.log(chalk.white.bgGreen('Server is up on port ' + port))
})