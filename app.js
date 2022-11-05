const express = require("express"); //把 express 載入
const exphbs = require("express-handlebars"); //把 express-handlebars 載入
const movies = require('./movies.json')//給的是路徑，會去載檔案（給名字會去找node_modules）
const app = express(); //把載入的 express 套件在執行後，存成一個名為 app 的變數，之後，我們就可以透過 app 這個物件，來使用 Express 這個框架所提供的方法 (method)
const port = 3000; //在 Express 中，如果沒有定義 hostname ，Express 就會預設用 localhost
let searchResults = []
let moviesMap = {}
movies.results.forEach(movie => moviesMap[Number(movie.id)] = movie)

// setting template engine
//app.engine：透過這個方法來定義要使用的樣板引擎
//參數一：樣板引擎的名稱 參數二：此樣板引擎相關的設定
app.engine("handlebars", exphbs({ defaultLayout: "main" })); //設定預設的佈局（default layout）需使用名為 main 的檔案，之後再來建立 main 檔案

//app.set：透過這個方法告訴 Express 說要設定的 view engine 是 handlebars
app.set("view engine", "handlebars");

//告訴express 靜態頁面放在哪裡
app.use(express.static("public")); //表示所有請求近來都要先走這道

app.get("/", (req, res) => {
  //把原本的 res.send() 改成 res.render('index')
  //Express 會在使用者輸入 localhost:3000 進到根目錄時，根據 index.handlebars 這支檔案回傳對應的 HTML 給瀏覽器
  // {movie:movieInfo}：把movie這個變數傳進模板引擎，並使用movies.results的值
  res.render('index', { movies: movies.results });
});

app.get("/search", (req, res) => {
  const keyWord =req.query.keyWord
  searchResults = movies.results.filter((movie) => {
    return movie.title.toLowerCase().trim().includes(keyWord.toLowerCase())
  })
  res.render('index', { movies: searchResults , keyWord: keyWord });
});

app.get("/movies/:id", (req, res) => {
  //把原本的 res.send() 改成 res.render('index')
  //Express 會在使用者輸入 localhost:3000 進到根目錄時，根據 index.handlebars 這支檔案回傳對應的 HTML 給瀏覽器
  // {movie:movieInfo}：把movie這個變數傳進模板引擎，並使用movies.results的值
  const id = Number(req.params.id)
  const movieInfo = moviesMap[`${id}`]
  res.render('show', {movie: movieInfo});
});

//啟動伺服器
app.listen(port, () => {
  console.log(`express is running on http://localhost:${port}`);
});
