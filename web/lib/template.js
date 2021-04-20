module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <style>
        #grid{
          display:grid;
          grid-template-rows: 30px 1fr;
        }
        div {
          text-align:center;
        }
        h1 {
          font-size: 40px;
          text-align: center;
        }
        a {
          text-decoration-line: none;
        }
        .myButton {
          width:240px;
          background-color:#44c767;
          border-radius:30px;
          border:2px solid #18ab29;
          display:inline-block;
          cursor:pointer;
          color:#ffffff;
          font-size:28px;
          font-weight:bold;
          padding:32px 54px;
          text-decoration:none;
          text-shadow:0px 1px 0px #2f6627;
          margin:10px;
        }
        .myButton:hover {
          background-color:#5cbf2a;
        }
        .myButton:active {//when click button
          position:relative;
          top:1px;
        }
      </style>
      <title>STCat House - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">STCat House</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }
}

/*<link rel="stylesheet" href="/css/main.css">
<script>
  function sheetLoaded() {
  // Do something interesting; the sheet has been loaded
  }
  function sheetError() {
    alert("An error occurred loading the stylesheet!");
  }
</script>*/
