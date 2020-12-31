const express=require('express');
const fs=require('fs');

const app= express();

app.use(express.urlencoded({extended:true}));

app.set('view engine','hbs');

// app.use('/public',express.static(__dirname + '/public'));
let objmain={}
let objreturn={};
let db={};
let cachearr=[];
app.get('/',(req,res)=>{
    res.render('home',{title:'Freshworks',objreturn});
});

let maindata=undefined;

app.post('/',(req,res)=>{
    let value=req.body.inputV;
    let kkey=req.body.inputK;
    let selectBtn=req.body.selectBtn;
        if(selectBtn=='createBtn')
        {
            let contains=cachearr.includes(kkey);
            if(contains)
            {
                throw "Key already exist";
            }
            else
            {
                cachearr.push(kkey);
                objmain[kkey]=value;
                db1=Object.assign(objmain,db);
                fs.writeFileSync("db.json",JSON.stringify(db1),(err)=>{
                    if(err)
                        throw err;
                    console.log('done');
                });
                res.redirect('/');
            }
            
        }
        if(selectBtn=='readBtn')
        {
            const path="./db.json"
            if(fs.existsSync(path))
            {
                const jsonString = fs.readFileSync('./db.json')
                const jsonData = JSON.parse(jsonString)
                if(jsonData[kkey]===undefined)
                    throw "Key doesn't exist";
                res.send(jsonData[kkey]);
            }
            else
            {
                throw "You didn't enter anything till now";
            }
        }
        if(selectBtn=='deleteBtn')
        {
            console.log("in delete");
            const path="./db.json"
            if(fs.existsSync(path))
            {
            const jsonString = fs.readFileSync('./db.json');
            const jsonData = JSON.parse(jsonString);
            if(jsonData[kkey]===undefined)
                throw "You can't delete , because key doesn't exists";
            delete jsonData[kkey];
            console.log(jsonData);
            db1=Object.assign(jsonData,db);
            fs.writeFileSync("db.json",JSON.stringify(db1),(err)=>{
                if(err)
                    throw err;
                console.log('done');
            });
            res.send("Key deleted successfully");
            }
            else
            {
                throw "You can't delete anything , nothing exists in database";
            }
        }
})
app.listen(4545,()=>{
    console.log("Server started at http://localhost:4545");
});