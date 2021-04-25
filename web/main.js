var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  if (req.query.id) {
    fs.readdir('./data', function(error, filelist){
      fs.readFile(`data/${req.query.id}`, 'utf8', function(err, description){
        const title = req.query.id;
        const list = template.list(filelist);
        const html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          ` <a href="/create">create</a>
            <a href="/update?id=${title}">update</a>
            <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="delete">
            </form>`
        );
        return res.status(200).send(html);
      });
    });
  } else {
    fs.readdir('./data', (err, filelist) => {
      if (err) {
        return res.status(500).json({'result': `error:${err}`});
      }
      const title = 'Welcome';
      const description = 'Hello, this is application for stray cats!';
      const html = template.HTML(title, '', `
        <div style="background-size:400px 120px;padding-bottom:50px;background-color:lightblue;"><h2>${title}</h2>${description}</div>
        <div id="grid">
          <div id="row1">
            <a href="/feed_process"><input type="button" class="myButton" value="사료주기"></a>
            <a href="/water_process"><input type="button" class="myButton" value="물주기"></a>
          </div>
          <div id="row2">
            <a href="/map"><input type="button" class="myButton" value="지도"></a>
            <a href="/community"><input type="button" class="myButton" value="커뮤니티"></a>
          </div>
        </div>
      `, '');
      res.status(200).send(html);
    });
  }
});

app.get('/create', (req, res) => {
  fs.readdir('./data', function(error, filelist){
    var title = 'WEB - create';
    var list = template.list(filelist);
    var html = template.HTML(title, list, `
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `, '');
    return res.status(200).send(html);
  });
});

app.get('/create_process', (req, res) => {
  var body = '';
  req.on('data', (data) => {
    body = body + data;
  });
  req.on('end', () => {
    var post = qs.parse(body);
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      return res.status(302).json({Location: `/?=${title}`});
    });
  });
});

app.get('/update', (req, res) => {
  fs.readdir('./data', function(error, filelist){
    fs.readFile(`data/${req.query.id}`, 'utf8', function(err, description){
      var title = req.query.id;
      var list = template.list(filelist);
      var html = template.HTML(title, list,
        `
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
      );
      return res.status(200).send(html);
    });
  });
});

app.get('/update_process', (req, res) => {
  var body = '';
  req.on('data', function(data){
    body = body + data;
  });
  req.on('end', function(){
    var post = qs.parse(body);
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(error){
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        return res.status(302).json({Location: `/?id=${title}`});
      })
    });
  });
});

app.get('/delete_process', (req, res) => {
  var body = '';
  req.on('data', function(data){
      body = body + data;
  });
  req.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      fs.unlink(`data/${id}`, function(error){
        return res.status(302).json({Location: '/'});
      });
  });
});

app.get('/map', (req, res) => {
  fs.readdir('./data', function(error, filelist){
    var title = 'STCat House - Map';
    //body부분에 지도API를 본문으로 가져오기.
    var html = template.HTML(title,'',
      `<h2>Map</h2>
       <div id="map" style="width:500px;height:400px;"></div>
       <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=c6ed5d810eeed58e0c7cadca05d82aad"></script>
       <script>
         var container = document.getElementById('map');
         var options = {center: new kakao.maps.LatLng(35.888836,128.608111),level: 2};
        var map = new kakao.maps.Map(container, options);
       </script>`,
      '');
    return res.status(200).send(html);
  });
});

app.listen(3000, () => {
  console.log('server started on port 3000');
});