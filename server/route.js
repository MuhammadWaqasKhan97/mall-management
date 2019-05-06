const Admin_col = require('../server/models/admin.js');
const Shop_col = require('../server/models/shop.js');
const Doc_col = require('../server/models/doc.js');
const Bill_col = require('../server/models/bill.js');
const Report_col = require('../server/models/reports.js');
const Manager_col = require('../server/models/manager.js');
const Accountant_col = require('../server/models/accountant.js');
const Notification_col = require('../server/models/notification.js');
const Security_col = require('../server/models/security.js');
const FM_employees = require('../server/models/falconmart_employees.js');
const MC_employees = require('../server/models/microchip_employees.js');
let csv = require('fast-csv');


var nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "rapshek@gmail.com", // generated ethereal user
        pass: "logical007" // generated ethereal password
    },
    tls:{
        rejectUnauthorized:false
    }
});
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
module.exports = function(app){
    app.get('/admin/login',function(req,res){
        if(req.cookies.admin){
            res.redirect("/admin");
        }
        else if(req.cookies.manager){
            res.redirect("/manager");

        }
        else if(req.cookies.shop){
            res.redirect("/shop");
        }
        else{
            res.render('admin_login');
        }
    });
    app.get('/', function(req, res){
        if(req.cookies.admin){
            res.redirect("/admin");
        }
        else if(req.cookies.manager){
            res.redirect("/manager");

        }
        else if(req.cookies.shop){
            res.redirect("/shop");
        }
        else{
          //res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
          //  res.render('index');
          res.render('landing');
        }
       
    });
    app.get('/login', function(req, res){
        if(req.cookies.admin){
            res.redirect("/admin");
        }
        else if(req.cookies.manager){
            res.redirect("/manager");

        }
        else if(req.cookies.shop){
            res.redirect("/shop");
        }
        else{
          //res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.render('generic_login');
        }
       
    });
    app.post('/login', function(req, res){
        let user = {username: req.body.username,password:req.body.password}
        Manager_col.findOne(user,(err,manager)=>{
            if(manager){

                res.cookie("manager",JSON.stringify(manager),{maxAge:1000*60*60*24*7});
                res.redirect('/manager');
            }
            else{
                Shop_col.findOne(user,(err,shop)=>{
                    if(shop){
                        res.cookie("shop",JSON.stringify(shop),{maxAge:1000*60*60*24*2});
                         res.redirect('/shop');
                    }
                    else{
                        Accountant_col.findOne(user,(err,accountant)=>{
                            res.cookie("accountant",JSON.stringify(accountant),{maxAge:1000*60*60*24*2});
                         res.redirect('/accountant');
                        })
                    }
                })
            }
        })
       
    });


    //SHOPS PORTAL ///
    app.get("/shop",(req,res)=>{
        if(req.cookies.shop){
            let shop_ = JSON.parse(req.cookies.shop);

            console.log("shop_id:",shop_.username);
             Shop_col.findOne({"username":shop_.username},(err,shop)=>{
                console.log("shop detail:",shop);
                Notification_col.find({to:shop_._id},(err,notices)=>{
                    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                    res.render("shop/index",{shop:shop,notifications:notices});
                })

               

             })
        }
        else{
            res.redirect("/");
        }
    });
    app.get("/admin/shop/get/:id",(req,res)=>{
        let id = req.params.id;
        Shop_col.findById(id,(err,shop)=>{
            if(err){throw err};
      // let str = JSON.stringify(shop);
         Doc_col.find({shop_id:id},(err,docs)=>{
                res.json({success:true,shop:shop,docs:docs});
                res.end();
             })
       

        })
    });
    app.get("/shop/get/:id",(req,res)=>{
        let id = req.params.id;
        Shop_col.findById(id,(err,shop)=>{
            if(err){throw err};
      // let str = JSON.stringify(shop);
     Bill_col.find({shop_id:id},(err,bills)=>{
         Doc_col.find({shop_id:id},(err,docs)=>{
             Security_col.find({shop_id:id},(err,security)=>{
                res.json({success:true,shop:shop,bills:bills,docs:docs,securities:security});
                res.end();
             })
           
         })
       
     })
       

        })
    });
    app.get("/security_forms",(req,res)=>{
        if(req.cookies.admin || req.cookies.manager){
            Security_col.find({},(err,security_forms)=>{
                res.json({security_forms:security_forms});
                res.end();
            })
        }
        else{
            res.redirect("/");
        }
    });

    app.get("/docs",(req,res)=>{
        if(req.cookies.admin || req.cookies.manager){
            Doc_col.find({},(err,docs)=>{
                res.json({docs:docs});
                res.end();
            })
        }
        else{
            res.redirect("/");
        }
    });
    app.get("/reports",(req,res)=>{
        if(req.cookies.admin || req.cookies.manager){
            Report_col.find({},(err,reports)=>{
                res.json({reports:reports});
                res.end();
            })
        }
        else{
            res.redirect("/");
        }
    });
    app.get("/bills",(req,res)=>{
        if(req.cookies.admin || req.cookies.manager){
            Bill_col.find({},(err,bills)=>{
                res.json({bills:bills});
                res.end();
            })
        }
        else{
            res.redirect("/");
        }
    })

    app.get("/shop/docs",(req,res)=>{
        if(req.cookies.shop){
            let id = JSON.parse(req.cookies.shop)._id;
            Doc_col.find({shop_id:id},(err,docs)=>{
                res.json({docs:docs});
                res.end();
            })
        }
        else{
            res.redirect("/");
        }   
    });
    app.get("/shop/bills",(req,res)=>{
        if(req.cookies.shop){
            let id = JSON.parse(req.cookies.shop)._id;
            Bill_col.find({shop_id:id},(err,bills)=>{
                res.json({bills:bills});
                res.end();
            })
        }
        else{
            res.redirect("/");
        }   
    });
    
    app.get("/shop/approve/:id",(req,res)=>{
        let shop_id = req.params.id;
        Shop_col.findById(shop_id,(err,shop)=>{
            let user = shop.owner_name.replace(" ","").replace("-","").replace(".","");
            let password = Math.random().toString(36).slice(-6);
            let manager_ref = shop.manager_ref;
            let notification = new Notification_col({
                title:'Shop Registration Approved',
                detail:'admin has approved your applied shop registration of '+shop.name,
                to:shop.manager_ref_id,
                date: new Date().getTime(),
                flag:'unread'

            });
            notification.save();
            let mail = {
                from: 'Falcon Mart <rapshek@gmail.com>', // sender address
                to: shop.email, // list of receivers
                subject: 'Your Shop is Registed', // Subject line
                text: "", // plain text body
                html: `<div>
                <h3>Congrats your Shop is regitered by `+manager_ref+` in Falcon Mart</h3>
                <label>username:</label><span>`+user+`</span><br>
                <label>password:</label><span>`+password+`</span><br>

                </div>` // html body
            };
             // send mail with defined transport object
            transporter.sendMail(mail, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                
        
            });

            Shop_col.findOneAndUpdate({_id:shop_id},{$set:{username:user,password:password,approved_flag:"1"}},(err,shop,resp)=>{
              console.log(shop)
               // res.end(user +"-----" +password)
                res.redirect("/admin")
            })

        })
       
        
    });
    app.get("/logout",(req,res)=>{
       
        res.clearCookie("shop");
        res.clearCookie("admin");
        res.clearCookie("manager");
        res.clearCookie("accountant");

        res.redirect("/");
    })
    app.post('/shop/login',(req,res)=>{
       let username = req.body.username;
       let password = req.body.password;
       Shop_col.find({username:username,password:password},(err,shop)=>{
         if(shop.length>=1){
            res.cookie("shop",JSON.stringify(shop[0]),{maxAge:1000*60*60*24*7});
            res.redirect('/shop');
         }  
         else{
             res.redirect("/");
         }
       
       })
    });
    app.get("/api",(req,res)=>{
        res.end("haha")
    })
    app.post('/shop/security',(req,res)=>{
        if(req.cookies.shop){
            let shop_id = JSON.parse(req.cookies.shop)._id;
            let shop_name = JSON.parse(req.cookies.shop).name;

            let name = req.body.name;
            let cnic = req.body.cnic;
            let address = req.body.address;
           let security = new Security_col({
               shop_name : shop_name,
               shop_id:shop_id,
               name:name,
               cnic:cnic,
               address:address
           });
           security.save((err,resp)=>{
               if(err){throw err};
               console.log(resp);
               Manager_col.find({},(err,managers)=>{
                   managers.forEach((manager)=>{
                    new Notification_col({
                        title:'Security Form has been Added',
                        detail:shop_name +' has added security form',
                        date:new Date().getTime(),
                        to:manager._id,
                        flag:'unread'
                    }).save();  
                   });
                   new Notification_col({
                    title:'Security Form has been Added',
                    detail:shop_name +' has added security form',
                    date:new Date().getTime(),
                    to:'admin',
                    flag:'unread'

                }).save();  
               })
            
               res.redirect("/shop");

              // res.json({security:resp});
              // res.end();
           })
        }
       
     });
    app.post('/shop/add_employee',(req,res)=>{
        console.log("add_employee");
        let shop_id = JSON.parse(req.cookies.shop)._id;
        let form = new formidable.IncomingForm();
      
        form.parse(req,(err,fields,files)=>{
            let name = fields.name;
            let phone = fields.phone;
            let cnic = fields.cnic;
            let father_name = fields.father_name;
            let address = fields.address;
            console.log("check:");

            let unique =  Math.floor((Math.random()*100000)+(Math.random()*100000));
            var oldpath = files.pic.path;
            var path_new =path.join(__dirname ,"../client/public/content/pics/",shop_id+"_"+unique+"_"+files.pic.name);
            var db_path = path.join("./content/pics/",shop_id+"_"+unique+"_"+files.pic.name);
            let employee_obj = {'name':name,'phone':phone,'cnic':cnic,'pic':db_path,'father_name':father_name,'address':address};
            console.log("employee obj:",employee_obj);

            Shop_col.findById(shop_id,(err,shop)=>{
                console.log("old_list:",shop.employee_list);
                let old_array = JSON.parse(shop.employee_list);
                old_array.push(employee_obj);
                let new_list = JSON.stringify(old_array);
                console.log("new_list:",new_list);
                fs.copyFile(oldpath,path_new,(err)=>{
                    if(err){
                        throw err
                    }
                    fs.unlink(oldpath,(err_4)=>{
                        if(err_4){
                            throw err_4
                        }
                       
                    })
                })
                Shop_col.findOneAndUpdate({"_id":shop_id},{$set:{employee_list:new_list}},(err,resp)=>{
                    if(err){throw err};
                    res.redirect("/shop");
                })
            })
        });
      
        
       
     })
     app.post('/shop/settings',(req,res)=>{
        let pwd_old = req.body.pwd_old;
        let pwd_new = req.body.pwd_new;
        let obj = {'password':pwd_new};
        let shop_id = JSON.parse(req.cookies.shop)._id;   
            Shop_col.findOneAndUpdate({_id:shop_id,password:pwd_old},{$set:{password:pwd_new}},(err,shop,resp)=>{
                if(err){throw err};
                if(shop === null){
                    res.json({success:false});
                    res.end();
                }
                else{
                    console.log("checked shop:",shop);
                    res.json({success:true});
                    res.end();
                }
                
            });
         

        
     })
     app.post('/shop/delete',(req,res)=>{
        let id = req.body.id;
            Shop_col.findByIdAndDelete(id,(err,resp)=>{
                if(err){
                    throw err;
                }
                res.json({success:true});
                res.end();
            })
         

        
     })
    
     app.post('/shop/docs',(req,res)=>{
        let form = new formidable.IncomingForm();
        form.parse(req,(err,fields,files)=>{
            const unique = Math.floor(Math.random()*10000);
            let shop_name = fields.shop;
                let shop_id = "";
                Shop_col.findOne({name:shop_name},(err,shop)=>{
                  shop_id  = shop._id;  
                  let title= fields.title;
                  var oldpath = files.doc.path;
                  var path_new =path.join(__dirname ,"../client/public/content/docs/",shop_id+"_"+unique+"_"+files.doc.name);
                  var db_path = path.join("./content/docs/",shop_id+"_"+unique+"_"+files.doc.name);
                  var doc = new Doc_col({
                      shop_name:shop_name,
                      shop_id:shop_id,
                      title:title,
                      path:db_path,
                      date:new Date().getTime()
                  
                  });
                  doc.save(()=>{
                      fs.copyFile(oldpath,path_new,(err)=>{
                          if(err){
                              throw err
                          }
                          fs.unlink(oldpath,(err_4)=>{
                              if(err_4){
                                  throw err_4
                              }
                              console.log("new doc added");
                               res.redirect("/manager");
                          })
                      })
                  })
                  
      
              })
                });
                
           
        });
        app.post('/shop/bills',(req,res)=>{
            let form = new formidable.IncomingForm();
            form.parse(req,(err,fields,files)=>{
                const unique = Math.floor(Math.random()*10000);
                let shop_name = fields.shop;
                let shop_id = "";
                Shop_col.findOne({name:shop_name},(err,shop)=>{
                  shop_id  = shop._id;  
                  let title= fields.title;
                  var oldpath = files.bill.path;
                  var path_new =path.join(__dirname ,"../client/public/content/bills/",shop_id+"_"+unique+"_"+files.bill.name);
                  var db_path = path.join("./content/bills/",shop_id+"_"+unique+"_"+files.bill.name);
                  var bill = new Bill_col({
                      shop_name:shop_name,
                      shop_id:shop_id,
                      title:title,
                      path:db_path,
                      date:new Date().getTime()
                  
                  });
                  bill.save(()=>{
                      fs.copyFile(oldpath,path_new,(err)=>{
                          if(err){
                              throw err
                          }
                          fs.unlink(oldpath,(err_4)=>{
                              if(err_4){
                                  throw err_4
                              }
                              console.log("new bill added");
                               res.redirect("/manager");
                          })
                      })
                  })
                  
      
              })
                });
                

              
            });
    
 ///// admin portal
 app.get("/admin",(req,res)=>{
    
     if(req.cookies.admin){
         let admin_ = JSON.parse(req.cookies.admin);
        

        Admin_col.findOne({"username":admin_.username},(err,admin)=>{
            console.log("admin detail:",admin );
         Shop_col.find({},(err,shops)=>{
            console.log(shops);
                    Notification_col.find({to:'admin'},(err,notifications)=>{
                        MC_employees.find({},(err,mc_employees)=>{
                                res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                                res.render("admin/index",{admin:admin,shops:shops,notifications:notifications,mc_employees:mc_employees});

                            

                        });
            })
         })
           
        });
          
     }
     else{
         res.redirect("/");
     }
 });
 app.get('/admin/notifications',(req,res)=>{
     Notification_col.find({to:'admin'},(req,notifications)=>{
         res.json({notifications:notifications});
         res.end();
     })
 });
app.get('/admin/get_employees',(req,res)=>{
    MC_employees.find({},(err,employees)=>{
        res.json({employees:employees});
        res.end();
    })
})
 app.post('/admin/add_employee',(req,res)=>{
    let form = new formidable.IncomingForm();
      
    form.parse(req,(err,fields,files)=>{
        let name = fields.name;
        let phone = fields.phone;
        let cnic = fields.cnic;
        let email = fields.email;
        let salary = fields.salary;
        let role = fields.pos;
        console.log(role);
        let father_name = fields.father_name;
        let address = fields.address;
        console.log("check:");

        let unique =  Math.floor((Math.random()*100000)+(Math.random()*100000));
        var oldpath = files.pic.path;
        var path_new =path.join(__dirname ,"../client/public/content/pics/",unique+"_"+files.pic.name);
        var db_path = path.join("./content/pics/",unique+"_"+files.pic.name);
        let employee_obj = {'name':name,'phone':phone,'cnic':cnic,'pic':db_path,'father_name':father_name,'address':address,'role':role,'email':email,'salary':salary};
         if( role === "manager"){
             /// add a manager
             const username = name.toLowerCase()+Math.floor((Math.random()*10000)+(Math.random()*10000));
             const password = Math.random().toString(36).slice(-6);
             let manager_obj = {'name':name,'email':email,'username':username,'password':password};

              new Manager_col(manager_obj).save((err,manager)=>{
                let mail = {
                    from: 'Falcon Mart <rapshek@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: 'Microchip Employment', // Subject line
                    text: "", // plain text body
                    html: `<div>
                    <h3>Congrats you are now a part of Microchip</h3>
                    <h4>You are assigned as a manager,your login credentials are as follow</h4>
                    <label>username:</label><span>`+username+`</span><br>
                    <label>password:</label><span>`+password+`</span><br>
                    <hr>
                    <a href='http://localhost/login' >go to this link ,to login</a>
                    </div>` // html body
                };
                 // send mail with defined transport object
                transporter.sendMail(mail, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    
            
                });
    
              })
             /// add a manager
         }
         if(role === "accountant"){
             /// add an accountant
             const username = name.toLowerCase()+Math.floor((Math.random()*10000)+(Math.random()*10000));
             const password = Math.random().toString(36).slice(-6);
             let accountant_obj = {'name':name,'email':email,'username':username,'password':password};

              new Accountant_col(accountant_obj).save((err,accountant)=>{
                let mail = {
                    from: 'Falcon Mart <rapshek@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: 'Microchip Employment', // Subject line
                    text: "", // plain text body
                    html: `<div>
                    <h3>Congrats you are now a part of Microchip</h3>
                    <h4>You are assigned as an accountant,your login credentials are as follow</h4>
                    <label>username:</label><span>`+username+`</span><br>
                    <label>password:</label><span>`+password+`</span><br>
                    <hr>
                    <a href='http://localhost/login' >go to this link ,to login</a>
                    </div>` // html body
                };
                 // send mail with defined transport object
                transporter.sendMail(mail, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    
            
                });
    
              })
             /// add an accountant

         }
        console.log("employee obj:",employee_obj);

       
            fs.copyFile(oldpath,path_new,(err)=>{
                if(err){
                    throw err
                }
                fs.unlink(oldpath,(err_4)=>{
                    if(err_4){
                        throw err_4
                    }
                   
                })
            })
           new MC_employees(employee_obj).save((err,employee)=>{
            res.redirect('/admin');
           })
        })

  
  })
 app.post('/admin/login',(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    console.log(username + password);
    Admin_col.find({username:username,password:password},(err,admin)=>{
        if(err){throw err};
     if(admin[0]===undefined){
        res.redirect("/");
     }
     else{
        res.cookie("admin",JSON.stringify(admin[0]),{maxAge:1000*60*60*24*7});
        res.redirect('/admin');
     }
    
    })
 });
 app.post('/admin/settings',(req,res)=>{
    let pwd_old = req.body.pwd_old;
    let pwd_new = req.body.pwd_new;
    let obj = {'password':pwd_new};
    let admin_id = JSON.parse(req.cookies.admin)._id;   
        Admin_col.findOneAndUpdate({_id:admin_id,password:pwd_old},{$set:{password:pwd_new}},(err,admin,resp)=>{
            if(err){throw err};
            if(admin === null){
                res.json({"success":false});
                res.end();
              //  res.redirect('/logout')
            }
            else{
                console.log("checked admin:",admin);
          //  res.redirect("/admin");
            res.json({"success":true});
                res.end();
            }
            
        });
     

    
 })
 app.post('/manager/settings',(req,res)=>{
    let pwd_old = req.body.pwd_old;
    let pwd_new = req.body.pwd_new;
    let obj = {'password':pwd_new};
    let manager_id = JSON.parse(req.cookies.manager)._id;   
        Manager_col.findOneAndUpdate({_id:manager_id,password:pwd_old},{$set:{password:pwd_new}},(err,manager,resp)=>{
            if(err){throw err};
            if(manager === null){
                res.json({"success":false});
                res.end();
              //  res.redirect('/logout')
            }
            else{
                console.log("checked admin:",manager);
          //  res.redirect("/admin");
            res.json({"success":true});
                res.end();
            }
            
        });
     

    
 })
 app.post('/accountant/settings',(req,res)=>{
    let pwd_old = req.body.pwd_old;
    let pwd_new = req.body.pwd_new;
    let accountant_id = JSON.parse(req.cookies.accountant)._id;   
        Accountant_col.findOneAndUpdate({_id:accountant_id,password:pwd_old},{$set:{password:pwd_new}},(err,accountant,resp)=>{
            if(err){throw err};
            if(accountant === null){
                res.json({"success":false});
                res.end();
              //  res.redirect('/logout')
            }
            else{
                console.log("checked admin:",accountant);
          //  res.redirect("/admin");
            res.json({"success":true});
                res.end();
            }
            
        });
     

    
 })
 /////////// accountant portal
 app.get("/accountant",(req,res)=>{
    
    if(req.cookies.accountant){
        let accountant_ = JSON.parse(req.cookies.accountant);
       

       Accountant_col.findOne({"username":accountant_.username},(err,accountant)=>{
           console.log("manager detail:",accountant );
        Shop_col.find({},(err,shops)=>{
           console.log(shops);
          MC_employees.find({},(err,employees)=>{

         
                        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                        res.render("accountant/index",{accountant:accountant,shops:shops,employees:employees});   
                    })        
               
           
        })
          
       });
         
    }
    else{
        res.redirect("/");
    }
});
app.post('/accountant/report',(req,res)=>{
    let total_rents=0 , total_expenses=0 ;
    let rents =  JSON.parse(req.body.rents);
    let expenses = JSON.parse(req.body.expenses);
    let salaries = req.body.salaries; 
    let csv_array = [];
    let accountant_name = JSON.parse(req.cookies.accountant).name;
    csv_array.push(["Monthly Report"]);
    csv_array.push(["Generated on",new Date(new Date().getTime())]);
    csv_array.push(["Accountant",accountant_name]);
    csv_array.push(["----------------------------------------------"]);
    csv_array.push(["RENTS LIST"]);
    csv_array.push(["  "]);
    csv_array.push(["Shop Name","Rent(pkr)","Months","Total"]);
    csv_array.push(["  "]);
    rents.forEach((rent)=>{
        csv_array.push([rent[0],rent[1],rent[2],rent[3]]);
        Shop_col.findOne({name:rent[0]},(err,shop)=>{
            let date = parseInt(rent[2])*1000*60*60*24*30 ;
            let ndate = parseInt(shop.last_paid) +   date; 
            console.log("new date of "+rent[0]+":",new Date(ndate));
            shop.last_paid = ndate;
            shop.save((err,shop)=>{
                console.log("rent_updated");
            })     

        })
       // let c_date = new Date().getTime();
        total_rents += parseInt(rent[3]) ;
    });
    csv_array.push(["Total Rents",total_rents]);
    csv_array.push(["-----------     "]);
    csv_array.push(["EXPENSES LIST"]);
    csv_array.push(["Title","Expense(pkr)","Person"]);


    expenses.forEach((expense)=>{
        csv_array.push([expense[0],expense[1],expense[2]]);
        total_expenses += expense[1];

    });
    csv_array.push(["Total Expenses",total_expenses]);
    csv_array.push(["-----------     "]);
    csv_array.push(["Salaries",salaries]);
    csv_array.push(["-----------     "]);
    csv_array.push(["Net",(total_rents-total_expenses - salaries)]);
    csv_array.push(["-----------     "]);
    const title = "Report_"+ new Date(new Date().getTime());
    const file_name = "Report_"+Math.floor(Math.random()*100000)+"_.csv";
    let db_path = path.join('./content/reports/',file_name);
    csv.writeToPath(path.join(__dirname,"../client/public/content/reports/",file_name),csv_array,{headers:true});
   new Report_col({'title':title,'path':db_path,'date':new Date().getTime()}).save((err,report)=>{
    res.json({expenses:expenses,rents:rents});
    res.end();
   })
    //     let ws = fs.createWriteStream(file_name);
    // csv.write(csv_array,{headers:true}).pipe(ws);
    //     fs.copyFile(file_name,"new_file.csv",(err)=>{
    //         if(err){throw err};
    //     });
    
    
      
   
    
})


 //// accountant portal
  ///// manager portal
  app.get("/manager",(req,res)=>{
    
    if(req.cookies.manager){
        let manager_ = JSON.parse(req.cookies.manager);
       

       Manager_col.findOne({"username":manager_.username},(err,manager)=>{
           console.log("manager detail:",manager );
        Shop_col.find({},(err,shops)=>{
           console.log(shops);
          
                Notification_col.find({to:manager_._id},(err,notifications)=>{
                    FM_employees.find({},(err,employees)=>{
                        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
                        res.render("manager/index",{manager:manager,shops:shops,notifications:notifications,employees:employees});

                    })
               
           })
        })
          
       });
         
    }
    else{
        res.redirect("/");
    }
});

  app.post('/manager/add_employee',(req,res)=>{
    let form = new formidable.IncomingForm();
      
    form.parse(req,(err,fields,files)=>{
        let name = fields.name;
        let phone = fields.phone;
        let cnic = fields.cnic;
        let role = fields.role;
        let father_name = fields.father_name;
        let address = fields.address;
        console.log("check:");

        let unique =  Math.floor((Math.random()*100000)+(Math.random()*100000));
        var oldpath = files.pic.path;
        var path_new =path.join(__dirname ,"../client/public/content/pics/",unique+"_"+files.pic.name);
        var db_path = path.join("./content/pics/",unique+"_"+files.pic.name);
        let employee_obj = {'name':name,'phone':phone,'cnic':cnic,'pic':db_path,'father_name':father_name,'address':address,'role':role};
        console.log("employee obj:",employee_obj);

       
            fs.copyFile(oldpath,path_new,(err)=>{
                if(err){
                    throw err
                }
                fs.unlink(oldpath,(err_4)=>{
                    if(err_4){
                        throw err_4
                    }
                   
                })
            })
           new FM_employees(employee_obj).save((err,employee)=>{
            res.redirect('/manager');
           })
        })

  
  });
  app.post('/manager/login',(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    Manager_col.find({username:username,password:password},(err,manager)=>{
        if(err){throw err};
     if(manager[0]===undefined){
        res.redirect("/");
     }
     else{
        res.cookie("manager",JSON.stringify(manager[0]),{maxAge:1000*60*60*24*7});
        res.redirect('/manager');
     }
    
    })
 });
 app.get('/manager/rent_paid/:id',(req,res)=>{
     let id= req.params.id;
     let current_time = new Date().getTime();
     Shop_col.findByIdAndUpdate(id,{$set:{last_paid:current_time}},(err,resp)=>{
         if(err){throw err};
         console.log('response:',resp);
         let notification = new Notification_col({
             title:'Rent Paid',
             detail:JSON.stringify(resp),
             to:'admin',
             date: new Date().getTime(),
             flag:'unread'
         });
         notification.save();
         res.redirect('/manager');
     })
 })
 app.get('/notifications/read/:id',(req,res)=>{
     let id = req.params.id;
     Notification_col.findByIdAndUpdate(id,{$set:{flag:'read'}},(err,resp)=>{
         res.json({success:true});
     })
 });
 app.post('/send_notice',(req,res)=>{
     if(req.cookies.admin || req.cookies.manager){
         let from="Falcon Mart Manager";
         if(req.cookies.admin){
           from = "Microchip Admin"
         }
         
        let title= req.body.title;
     let detail = req.body.detail;
     let shop_id = req.body.shop_id;
     new Notification_col({
         title:title,
         detail:detail,
         to:shop_id,
         from:from,
         date:new Date().getTime(),
         flag:'unread'
     }).save((err,resp)=>{
        res.redirect("/");
     })
     }
     else{
         res.redirect("/");
     }
     

 })
 app.post('/manager/add_shop',(req,res)=>{
    let name = req.body.name;
    let number = req.body.number;
    let type = req.body.type;
    let phone = req.body.phone;
    let owner = req.body.owner_name;
    let email = req.body.email;
    let rent = req.body.rent;
    let manager_id = JSON.parse(req.cookies.manager)._id;
    let manager_name = JSON.parse(req.cookies.manager).name;
    let last_paid = new Date().getTime() - (1000*60*60*24*30);

  
    let shop_obj = {name:name,phone:phone,shop_number:number,owner_name:owner,email:email,manager_ref:manager_name,manager_ref_id:manager_id,approved_flag:'0',employee_list:"[]",last_paid:last_paid,rent:rent};
   console.log("shop obj:",shop_obj);
   let notification = new Notification_col({
    title:'New Shop Added',
    detail:manager_name + ' has added a new shop of ' +name,
    to:'admin',
    date: new Date().getTime(),
    flag:'unread'
});
notification.save();
    let shop = new Shop_col(shop_obj);
    shop.save(()=>{
        res.json({success:true});
    })
 })




}