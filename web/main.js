var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){//pathname없는경우.
      if(queryData.id === undefined){//home화면.쿼리없는경우.
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, this is application for stray cats!';
          //<a href="#" class="myButton">사료주기</a> css적용안됨 why?
          var html = template.HTML(title, '',
            `<div style="background-size:400px 120px;padding-bottom:50px;background-color:lightblue;"><h2>${title}</h2>${description}</div>
            <div id="grid">
              <div id="row1">
                <a href="/feed_process"><input type="button" class="myButton" value="사료주기"></a>
                <a href="/water_process"><input type="button" class="myButton" value="물주기"></a>
              </div>
              <div id="row2">
                <a href="/map"><input type="button" class="myButton" value="지도"></a>
                <a href="/community"><input type="button" class="myButton" value="커뮤니티"></a>
              </div>
            </div>`,
            ''
          );
          response.writeHead(200);
          response.end(html);
        });
      } else {//쿼리있는경우.
        fs.readdir('./data', function(error, filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
            var title = queryData.id;
            var list = template.list(filelist);
            var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${title}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${title}">
                  <input type="submit" value="delete">
                </form>`
            );
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    } else if(pathname === '/create'){
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
        response.writeHead(200);
        response.end(html);
      });
    } else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`});
            response.end();
          })
      });
    } else if(pathname === '/update'){
      fs.readdir('./data', function(error, filelist){
        fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
          var title = queryData.id;
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
          response.writeHead(200);
          response.end(html);
        });
      });
    } else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var description = post.description;
          fs.rename(`data/${id}`, `data/${title}`, function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              response.writeHead(302, {Location: `/?id=${title}`});
              response.end();
            })
          });
      });
    } else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          fs.unlink(`data/${id}`, function(error){
            response.writeHead(302, {Location: `/`});
            response.end();
          })
      });
    } else if(pathname === '/feed_process'){//사료주기버튼 클릭시.
        //IoT기기의 서보모터 동작시키기.
        response.writeHead(302, {Location: '/'});//홈화면으로 돌아가기?.
        response.end();

    } else if(pathname === '/water_process'){//사료주기버튼 클릭시.
        //IoT기기의 펌프모터 동작시키기.
        response.writeHead(302, {Location: '/'});//홈화면으로 돌아가기?.
        response.end();

    } else if(pathname === '/map'){
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
        response.writeHead(200);
        response.end(html);
      });

    } else if(pathname === '/community'){
      fs.readdir('./data', function(error, filelist){
        var title = 'Community';
        var description = "Let's share your tips!";
        var list = template.list(filelist);
        //<a href="#" class="myButton">사료주기</a> css적용안됨 why?
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
      });

    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
