//載入套件
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurant')

const app = express()
const port = 3000

//和資料庫連線
mongoose.connect('mongodb://localhost/restaurant-list', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

//設定引擎
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
//使用靜態檔
app.use(express.static('public'))
//每筆請求都要透過body-parser前置處理
app.use(bodyParser.urlencoded({ extended: true }))
//server監聽
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})

//查看全部資料
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then((restaurants) => res.render('index', { restaurants }))
    .catch((error) => console.log(error))
})

//前往新增頁面的路由
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

//在資料庫新增資料的路由
app.post('/restaurants', (req, res) => {
  console.log(req.body)
  const name = req.body.name
  const nameEn = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const googleMap = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description
  return Restaurant.create({
    name,
    nameEn,
    category,
    image,
    location,
    phone,
    googleMap,
    rating,
    description,
  })
    .then(() => res.redirect('/'))
    .catch((error) => console.log(error))
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(
    (restaurant) => restaurant.id.toString() === req.params.restaurant_id
  )
  res.render('show', { restaurant: restaurant })
})
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter((restaurant) => {
    return (
      restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(keyword.toLowerCase())
    )
  })
  res.render('index', { restaurants: restaurants })
})
