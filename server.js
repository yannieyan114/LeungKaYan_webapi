var http = require('http');
var fs = require("fs");
var qs = require('querystring');

var MongoClient = require('mongodb').MongoClient;

var dbUrl = "mongodb://localhost:27017/";

http.createServer(function(request, response) {

	if(request.url === "/index"){
		sendFileContent(response, "index.html", "text/html");
	}else if(request.url === "/"){
		console.log("Requested URL is url" +request.url);
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write('<b>Hey there!</b><br /><br />This is the default response. Requested URL is: ' + request.url);
	}else if(request.url==="/login"){           
        if (request.method === "POST") {
            console.log("checking login");
        formData = '';
        msg = '';
        return request.on('data', function(data) {
          formData += data;
          console.log(formData);
          return request.on('end', function() {
         
            info=formData.split("&");  
            var a = [];
            for(i=0; i<info.length; i++){
                var d=info[i].split("=");
                a[i] =d[1];
            }

            var query = { reglogin: a[0] , regpassword: a[1]};
            MongoClient.connect(dbUrl, function(err, db) {
  				if (err) throw err;
  				var dbo = db.db("mydb");
				dbo.collection("customers").find(query).toArray(function(err, res) {
				console.log(res);
				//console.log("res[0]="+res[0]);
					var array=[];
						for(var i=0; i<res.length; i++){
							array.push(res[i].id);
							console.log(res[i].id);
						}					
					
					if (res[0]==null){
						console.log("Fail to login!!");
						response.end("Fail to login");
						return;
					}else if(res[0].reglogin==""){
						console.log("Fail to login");
						response.end("Fail to login");
						return;
					}else{
						console.log("login ok");
						response.end(res[0].id);
					}
    				db.close();
  				});
			});
            
          });

        });

		} else {
        sendFileContent(response, "index.html", "text/html");
		}
		
    }else if(request.url==="/reg"){     
        if (request.method === "POST") {
            console.log("registration");
        formData = '';
        msg = '';
			return request.on('data', function(data) {
			  formData += data;
			  console.log(formData);
			  return request.on('end', function() {
				var user;
				user = qs.parse(formData);
				var date =  String(new Date().getTime());
				user.id = date;
				msg = JSON.stringify(user);
				
				info=formData.split("&");  
				
				var a = [];
				for(i=0; i<info.length; i++){
					var d=info[i].split("=");
					a[i] =d[1];
				}
				console.log("msg="+msg);
				var query = { reglogin: a[0] };
				MongoClient.connect(dbUrl, function(err, db) {

						if (err) throw err;

						var dbo = db.db("mydb");
						dbo.collection("customers").find(query).toArray(function(err, res) {
						console.log(res);
						res1 = JSON.stringify(res);
			
						if (res1=="[]"){
							stringMsg = JSON.parse(msg);
							MongoClient.connect(dbUrl, function(err, db) {

								if (err) throw err;
								var dbo = db.db("mydb");
								var myobj = stringMsg;
								dbo.collection("customers").insertOne(myobj, function(err, res) {
								if (err) throw err;
								console.log("user inserted");
								db.close();
								});
							});
							console.log("Register Success.");
							return response.end("success");

						}else{
							db.close;
							console.log("Username have been used.");
							return response.end("used");
						}
						});           
				//response.end("okokss");
				});
				
			  }); 

			});
		} else {
        //form = publicPath + "ajaxSignupForm.html";
        sendFileContent(response, "index.html", "text/html");
		}
	  
	}else if(request.url==="/checkname"){           
        if (request.method === "POST") {
            console.log("checking name");
        formData = '';
        msg = '';
			return request.on('data', function(data) {
			  formData += data;
			  //console.log(formData);
			  return request.on('end', function() {
				var query = { id: formData};
				MongoClient.connect(dbUrl, function(err, db) {
						if (err) throw err;
						var dbo = db.db("mydb");
						dbo.collection("customers").find(query).toArray(function(err, res) {
						console.log(res);
						
						var array=[];
							for(var i=0; i<res.length; i++){
								array.push(res[i].reglogin);
								//console.log(res[i].reglogin);
							}					
						
						//console.log(res[0].reglogin);
						db.close();
						
						return response.end(array.toString());
						});
				});         
			  });
			});       
		} else {
        //form = publicPath + "ajaxSignupForm.html";
        sendFileContent(response, "index.html", "text/html");
		}
 
	} else if(request.url === "/favweb"){
		sendFileContent(response, "page2.html", "text/html");
	
	}else if(request.url==="/favlist"){
		if (request.method === "POST") {
            console.log("test");
        formData = '';
        msg = '';
			return request.on('data', function(data) {
			  formData += data;
			  console.log(formData);
			  return request.on('end', function() {
				var user;
				user = qs.parse(formData);
				//user.id = "123456";
				msg = JSON.stringify(user);
				info=formData.split("&");  
				for(i=0; i<info.length; i++){
					var d=info[i].split("=");
				}			
				console.log(d[0]);
				console.log(d[1]);
				stringMsg = JSON.parse(msg);
				MongoClient.connect(dbUrl, function(err, db) {
					if (err) throw err;
					var dbo = db.db("mydb");
					var myobj = stringMsg;
					dbo.collection("favlist").insertOne(myobj, function(err, res) {
					if (err) throw err;
					console.log("favlist inserted");
					db.close();
					});
				});           

				response.end("okokss");
			  });
			}); 
        }
		
	}else if(request.url==="/fav"){
              
        if (request.method === "POST") {
            console.log("addfav");
        formData = '';
        msg = '';
			return request.on('data', function(data) {
			  formData += data;
			  console.log(formData);
			  return request.on('end', function() {
				var user;
				user = qs.parse(formData);
				msg = JSON.stringify(user);
				
				info=formData.split("&");  
				
				for(i=0; i<info.length; i++){
					var d=info[i].split("=");              
				}
				
				console.log(d[0]);
				console.log(d[1]);
				
				stringMsg = JSON.parse(msg);
				MongoClient.connect(dbUrl, function(err, db) {
					if (err) throw err;
					var dbo = db.db("mydb");
					var myobj = stringMsg;
					dbo.collection("favlist").insertOne(myobj, function(err, res) {
					if (err) throw err;
					console.log("favlist inserted");
					db.close();
					});
				});
				response.end("okokss");
			  });
			}); 
        }
		
	}else if(request.url==="/del"){
              
        if (request.method === "DELETE") {
            console.log("delfav");
        formData = '';
        msg = '';
			return request.on('data', function(data) {
			  formData += data;
			  console.log(formData);
			  return request.on('end', function() {
				var user;
				user = qs.parse(formData);
				msg = JSON.stringify(user);
				
				//info=formData.split("&");  
				//for(i=0; i<info.length; i++){           
				//	var d=info[i].split("=");               
				//}
				
				//console.log(d[0]);
				//console.log(d[1]);
				
				stringMsg = JSON.parse(msg);
				MongoClient.connect(dbUrl, function(err, db) {
					if (err) throw err;
					var dbo = db.db("mydb");
					var myobj = stringMsg;
					dbo.collection("favlist").deleteOne(myobj, function(err, res) {
					//console.log(res);
					if (err) throw err;
					console.log("favlist deleted");
					//db.close();
					});
				});
				response.end("okokss");
			  });
			}); 
        }
		
	}else if(request.url==="/delMany"){
        if (request.method === "DELETE") {
            console.log("delMany");
        formData = '';
        msg = '';
			return request.on('data', function(data) {
			  formData += data;
			  console.log(formData);
			  return request.on('end', function() {
				var user;
				user = qs.parse(formData);
				msg = JSON.stringify(user);
				info=formData.split("&");  
				
				for(i=0; i<info.length; i++){           
					var d=info[i].split("=");               
				}
				
				stringMsg = JSON.parse(msg);
				MongoClient.connect(dbUrl, function(err, db) {
					if (err) throw err;
					var dbo = db.db("mydb");
					var myobj = stringMsg;
					dbo.collection("favlist").deleteMany(myobj, function(err, res) {
					if (err) throw err;
					console.log("favlist deleted");
					db.close();
					});
				});
				response.end("okokss");
			  });
			}); 
        }
		
	
	}else if(request.url==="/showfav"){          
        if (request.method === "POST") {
            console.log("show favlist");
        formData = '';
        msg = '';
        return request.on('data', function(data) {
          formData += data;
          //console.log(formData);
		  var query = { id: formData };
          return request.on('end', function() {
            MongoClient.connect(dbUrl, function(err, db) {

  					if (err) throw err;
  					var dbo = db.db("mydb");
					dbo.collection("favlist").find(query).toArray(function(err, res) {

					var array=[];
						for(var i=0; i<res.length; i++){
							//console.log(res.length);
							array.push(res[i]);
							//console.log("server"+res[i]);
						}
    				db.close();				
					return response.end(JSON.stringify(array));
  					});
			});
          });
        });
		} else {
        sendFileContent(response, "index.html", "text/html");
		}
		
	} else if(request.url === "/mod"){
		sendFileContent(response, "page3.html", "text/html");
	
	} else if(request.url==="/update2"){             
        if (request.method === "PUT") {
        formData = '';
        msg = '';
        return request.on('data', function(data) {
          formData += data;
          console.log("update page="+formData);
          return request.on('end', function() {
            info=formData.split("&");  
            var a = [];
            for(i=0; i<info.length; i++){              
                var d=info[i].split("=");
                a[i] =d[1];
            }
			var query = { id: a[0] , regpassword: a[1] };
            MongoClient.connect(dbUrl, function(err, db) {
  				if (err) throw err;
  				var dbo = db.db("mydb");
				dbo.collection("customers").find(query).toArray(function(err, res) {
					var array=[];
						for(var i=0; i<res.length; i++){
							array.push(res[i].id);
							console.log(res[i].id);
						}
					console.log(res[0]);
					if (res[0]==undefined){
						console.log("Please check the old password");
						return response.end("password error");
					}else{
						var myquery = { id: a[0] , regpassword: a[1] };
						var newvalues = { $set: { regpassword: a[2] } };
						dbo.collection("customers").updateOne(myquery, newvalues, function(err, res) {
						if (err) throw err;
						//console.log("data updated");
						//db.close();
						return response.end("password updated");
						});
					}
					
    				db.close();
					//response.end("data updated");
  				});

			});
          });
        });        
		} else {
			sendFileContent(response, "index.html", "text/html");
		}

	} else if(request.url === "/api/v1.0/favData"){
		sendFileContent(response, "api.html", "text/html");
		
	}else if(request.url==="/api"){
        
        if (request.method === "POST") {
            console.log("show api");
        formData = '';
        msg = '';
        return request.on('data', function(data) {
          formData += data;
          console.log("showing"+formData);
          return request.on('end', function() {
            var query = { id: formData };
			//console.log("now:"+query);
            MongoClient.connect(dbUrl, function(err, db) {			
  				if (err) throw err;
  				var dbo = db.db("mydb");				
				dbo.collection("favlist").find(query).toArray(function(err, res) {

				var array=[];
					for(var i=0; i<res.length; i++){
						array.push(res[i]);
					}
    			db.close();
				
				return response.end(JSON.stringify(array));
  				});

			});
          });

        });
        
		} else {
			sendFileContent(response, "index.html", "text/html");
       
		}	
	
	}else if(request.url==="/checkfav"){              
        if (request.method === "POST") {
        formData = '';
        msg = '';
        return request.on('data', function(data) {
          formData += data;
		  var query = { id: formData };
          return request.on('end', function() {
            MongoClient.connect(dbUrl, function(err, db) {
  				if (err) throw err;
  				var dbo = db.db("mydb");
				dbo.collection("favlist").find(query).toArray(function(err, res) {
					var array=[];
						for(var i=0; i<res.length; i++){
							array.push(res[i]);
							//console.log("server"+res[i]);
						}
    				db.close();
					return response.end(JSON.stringify(array));
  				});
			});
          });
        });
     
		} else {
			sendFileContent(response, "index.html", "text/html");
		}
	} else if(request.url === "/table"){
		sendFileContent(response, "page4.html", "text/html");
		
	}else if(/^\/[a-zA-Z0-9\/-/]*.js$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/javascript");
	}else if(/^\/[a-zA-Z0-9\/]*.min$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/css");
	}else if(/^\/[a-zA-Z0-9\-/]*.css$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/css");
	}else if(/^\/[a-zA-Z0-9\-/]*.js$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/javascript");
	}else if(/^\/[a-zA-Z0-9\/-/]*.bundle.min.js$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/javascript");
	}else if(/^\/[a-zA-Z0-9\/-/]*.css$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/css");
	}else if(/^\/[a-zA-Z0-9\/-]*.min.css$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/css");
	}else if(/^\/[a-zA-Z0-9\/]*.jpg$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/jpg");
	}else if(/^\/[a-zA-Z0-9\/]*.png$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/png");
	}else if(/^\/[a-zA-Z0-9-._\/]*.min.js$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/javascript");
	}else if(/^\/[a-zA-Z0-9-.\/-/]*.min.css.map$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/map");
	}else if(/^\/[a-zA-Z0-9\/-/]*.min.js.map$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/map");
	}else if(/^\/[a-zA-Z0-9\/-/]*.css.map$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/map");
	}else if(/^\/[a-zA-Z0-9\/-/]*.ico$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/ico");
	}else if(/^\/[a-zA-Z0-9\/-?/]*.ttf$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/font");
	}else if(/^\/[a-zA-Z0-9\/-?/]*.woff$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/woff");
	}else if(/^\/[a-zA-Z0-9\/-?/]*.woff2$/.test(request.url.toString())){
		sendFileContent(response, request.url.toString().substring(1), "text/woff2");
	}
	else{
		console.log("Requested URL is: " + request.url);
		response.end();
	}
}).listen(9999)

function sendFileContent(response, fileName, contentType){
	fs.readFile(fileName, function(err, data){
		if(err){
			response.writeHead(404);
			response.write("Not Found!");
		}
		else{
			response.writeHead(200, {'Content-Type': contentType});
			response.write(data);
		}
		response.end();
	});
}