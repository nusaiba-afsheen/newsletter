const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile( __dirname + "/signup.html");
    
});

app.post("/",function(req,res){

    const frst = req.body.fname;
    const lst= req.body.lname;
    const emailid = req.body.email_;
    
    console.log(frst,lst,emailid);

    const data = {
        "email_address": emailid,
        "status": "subscribed",
        "merge_fields": {
          "FNAME": frst,
          "LNAME": lst
        }
      };

    const jsonData =JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/55ada5da09/members";
    
    const options = {
        method: "POST",
        auth : "rnauser1:c01a6155d6433cc857fcfa1ee89f1c11-us10",
    };

    const request = https.request(url,options, function(response){

        if( response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })

        const statCode = response.statusCode;
        
    });

    request.write(jsonData);
    request.end(); 

});


app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000);

//apiKey: c01a6155d6433cc857fcfa1ee89f1c11-us10
//list ID : 55ada5da09 got at https://us10.admin.mailchimp.com/lists/settings/defaults?id=899864