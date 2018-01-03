var express = require('express');
var fs = require('fs');
var app = express();

var bodyParser = require("body-parser");

var http=require('http');
var querystring=require('querystring');
var path = require('path');

var currentPath=path.resolve(__dirname, '.');

var global_hostname='127.0.0.1';
var global_port=2614;

app.use(bodyParser.urlencoded({ extended: false }));

//var fileUpload = require('express-fileupload');
var multer  = require('multer');
var restler = require('restler');
//var upload = multer({ dest: 'uploads/' });


var createFolder = function(folder){
  try{
    fs.accessSync(folder);
  }catch(e){
    fs.mkdirSync(folder);
  }
};

var uploadFolder = '/uploads/';

createFolder(uploadFolder);

// 通过 filename 属性定制
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
  },
  filename: function (req, file, cb) {
    // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
    var length=file.originalname.split('.').length;
    cb(null, file.originalname.split('.')[0] + '-' + Date.now()+"."+file.originalname.split('.')[length-1]);
    //cb(null, Date.now()+"."+file.originalname.split('.')[length-1]);
  }
});
var upload = multer({storage: storage});

//var upload = multer({ dest: 'uploads/' });

//  主页输出 "Hello World"
app.get('/', function(req, res) {
  console.log("主页 GET 请求");
  res.send('Hello GET');
});


//upload files操作

app.post('/parse', function(req, res, next) {
  var tmp = req.body.file.split('/');
  var global_file = tmp.pop();
  if (!req.body.file) {
    res.send({result: 0, data: "文件请求失败!"});
    return;
  } else if (!req.body.column) {
    res.send({result: 0, data: "column验证失败!"});
    return;
  } else if (!req.body.type) {
    res.send({result: 0, data: "文档类型验证失败!"});
    return;
  }

  var options = {
    hostname: '127.0.0.1',
    port: 8000,
    path: req.body.file,
    method: 'GET'
  };

  var req = http.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    var html = "";
    res.on('data', function(chunk) {
      console.log('BODY: ' + chunk);
      html += chunk;
    });
    res.on('end', function() {
      console.log("end" + html);
      fs.writeFile(currentPath + uploadFolder + global_file, html, function(error, data) {
        if (error) throw error;
        //发送c#进行解析文件
        var data = {
          doc_url: currentPath + uploadFolder + global_file,
          column: req.body.column,
          type: req.body.type,
          ismerge: req.body.ismerge
        };

        var content = querystring.stringify(data);
        //console.log(data.doc_url);
        var options = {
          hostname: global_hostname,
          port: global_port,
          path: '/webservice2.asmx/resolve?' + content,
          method: 'GET'
        }

        //创建请求  
        var req = http.request(options, function(res_resolve) {
          //console.log('STATUS:'+res.statusCode);  
          //console.log('HEADERS:'+JSON.stringify(res.headers));  
          res_resolve.setEncoding('utf-8');
          html = '';
          res_resolve.on('data', function(chunk) {
            console.log('数据片段分隔-----------------------\r\n');
            html += chunk;
          });
          res_resolve.on('end', function() {
            console.log('响应结束********');
            res.send({data: html, result: 1});
            return;
          });
        });
        req.on('error', function(err) {
          //console.error(err);  
          res.send({data: err.message, result: 0});
          return;
        });
        req.end();//发送c# 解析


      });
    });

  });

  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  req.end();

});//post parse


app.post('/parse_bak', upload.single("file"), function(req, res, next) {


  if (!req.file) {
    res.send({result: 0, data: "文件保存失败!"});
    return;
  } else if (!req.body.column) {
    res.send({result: 0, data: "column验证失败!"});
    return;
  } else if (!req.body.type) {
    res.send({result: 0, data: "文档类型验证失败!"});
    return;
  }

  var data = {
    doc_url: currentPath + uploadFolder + req.file.filename,
    column: req.body.column,
    type: req.body.type,
    ismerge: req.body.ismerge
  };

  var content = querystring.stringify(data);
  //console.log(data.doc_url);
  var options = {
    hostname: global_hostname,
    port: global_port,
    path: '/webservice2.asmx/resolve?' + content,
    method: 'GET'
  }

  //创建请求  
  var req = http.request(options, function(res_resolve) {
    //console.log('STATUS:'+res.statusCode);  
    //console.log('HEADERS:'+JSON.stringify(res.headers));  
    res_resolve.setEncoding('utf-8');
    html = '';
    res_resolve.on('data', function(chunk) {
      console.log('数据片段分隔-----------------------\r\n');
      html += chunk;
    });
    res_resolve.on('end', function() {
      console.log('响应结束********');
      res.send({data: html, result: 1});
      return;
    });
  });
  req.on('error', function(err) {
    //console.error(err);  
    res.send({data: err.message, result: 0});
    return;
  });
  req.end();
});//post parse


app.post('/convert', upload.single("file"), function(req, res, next) {

  //res.send(req.body.column);return;
  if (!req.file) {
    res.send({result: 0, data: "文件保存失败!"});
    return;
  }
  var post_data = {
    sourcePath: currentPath + "/" + uploadFolder + req.file.filename
  }
  var content = querystring.stringify(post_data);

  var options = {
    hostname: global_hostname,
    port: global_port,
    path: '/webservice2.asmx/toPdf',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Content-Length': content.length
    }
  };

  var req = http.request(options, function(res_inner) {
    //res.setEncoding('utf8'); 
    html = '';
    res_inner.on('data', function(chunk) {
      html += chunk;
    });
    res_inner.on('end', function() {
      console.log('响应结束********');
      var meta = JSON.parse(html);
      console.log(currentPath + "/" + uploadFolder + meta.data);
      var path = currentPath + "/" + uploadFolder + meta.data;
      if (meta.code) {
        restler.post("http://localhost:8000/" + path, {
          multipart: true,
          data: {
            "folder_id": "0",
            //"file": restler.file(meta.data, null, null, null, "application/pdf")
            "file": restler.file(currentPath + "/" + uploadFolder + meta.data, null, fs.statSync(path).size, null, "application/pdf")
          }
        }).on("complete", function(data) {
          console.log("post data completed!");
          res.send({data: meta.data, result: 1});
          return;
        });

      } else {
        res.send({data: "文档转换失败!", result: 1});
        return;
      }

      //res.send({data:html,result:1});return ;
    });
  });

  req.on('error', function(e) {
    res.send({data: e.message, result: 0});
    return;
  });

  // write data to request body  
  req.write(content);
  console.log("start send post data   " + content);
  console.log(req.output);
  req.end();
});//强转为pdf文件的操作


app.post('/postFile', function(req, res, next) {

  console.log(req.body);
  return;
  var filename = req.body.type + '-' + Date.now() + ".docx";

  var filecontent = req.body.postData;
  var column = req.body.column;
  //var type = req.body.type;
// var ismerge=req.body.ismerge;

  fs.writeFile(filename, filecontent, function(err) {
    if (err) throw err;
    res.send("文件保存成功!");
  });

});

//  /del_user 页面响应
app.delete('/del_user', function(req, res) {
  console.log("/del_user 响应 DELETE 请求");
  res.send('删除页面');
});


// 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
app.get('/ab*cd', function(req, res) {
  console.log("/ab*cd GET 请求");
  res.send('正则匹配');
});


var server = app.listen(8500, function() {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)

});