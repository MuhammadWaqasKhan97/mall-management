function check_pwd() {
    if (document.getElementById("pwd").value !== document.getElementById("pwd_2").value) {
        alert('password does not match');
        document.getElementById('pwd_btn').disabled = true;
    }
    else {
        document.getElementById('pwd_btn').disabled = false;

    }
}
function pwd_change(e) {
    e.disabled=true;
    let pwd_old = document.getElementById("old_pwd").value;
    let pwd_new = document.getElementById("pwd").value;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            e.disabled = false ;
            let success = JSON.parse(this.responseText).success;
            if(success){
                alert("password successfully changed");
            }
            else{
                alert("You typed wrong credentials");
            }
        }
    };
    xhttp.open("POST", "/admin/settings", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("pwd_old=" + pwd_old + "&pwd_new=" + pwd_new);

}
function search_shop() {
    var input, filter, found, table, tr, td, i, j;
    input = document.getElementById("shop_q");
    filter = input.value.toUpperCase();
    table = document.getElementById("shop_table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                found = true;
            }
        }
        if (found) {
            tr[i].style.display = "";
            found = false;
        } else {
            tr[i].style.display = "none";
        }
    }
}


function load_mc_employees() {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let div = document.getElementById('employees_list');
            let str = '';
            let employees = JSON.parse(this.responseText).employees;
            employees.forEach((employee) => {
                str +=

                    `<div class="container py-3">
            <div class="card">
              <div class="row ">
                  <div class="col-md-8 px-3">
                    <div class="card-block px-3">
                    <div class="row person-data">
                    <div class="col-4">
                        <p>Designation</p>
                    </div>
                    <div class="col-8">
                        `+employee.role+`
                    </div>
                </div>

                <div class="row person-data">
                    <div class="col-4">
                        <p>Name</p>
                    </div>
                    <div class="col-8">
                    `+ employee.name + `

                    </div>
                </div>

                <div class="row person-data">
                    <div class="col-4">
                        <p>Father Name</p>
                    </div>
                    <div class="col-8">
                    `+ employee.father_name + `

                    </div>
                </div>

                <div class="row person-data">
                    <div class="col-4">
                        <p>Cnic No.</p>
                    </div>
                    <div class="col-8">
                    `+ employee.cnic + `
                    </div>
                </div>
                    </div>
                  </div>

                  <div class="col-md-4">
                  <img src="`+ employee.pic + `" class="w-100">
                </div>

                </div>
              </div>
            </div>
          </div>
  `

                //     ` <div class="container-fluid">
                //     <div class="container addemployee-body">
                //         <div class="container ">
                //             <div class="row card-info-section">
                //                 <div class="col-sm-8">
                //                     <div class="row person-data">
                //                         <div class="col-4">
                //                             <p>ID</p>
                //                         </div>
                //                         <div class="col-8">

                //                         </div>
                //                     </div>

                //                     <div class="row person-data">
                //                         <div class="col-4">
                //                             <p>Name</p>
                //                         </div>
                //                         <div class="col-8">
                //                         `+ employee.name +`

                //                         </div>
                //                     </div>

                //                     <div class="row person-data">
                //                         <div class="col-4">
                //                             <p>Father Name</p>
                //                         </div>
                //                         <div class="col-8">
                //                         `+ employee.father_name +`

                //                         </div>
                //                     </div>

                //                     <div class="row person-data">
                //                         <div class="col-4">
                //                             <p>Cnic No.</p>
                //                         </div>
                //                         <div class="col-8">
                //                         `+ employee.cnic +`
                //                         </div>
                //                     </div>
                //                 </div>

                //                 <div class="col-sm-4 photo">
                //                         <img src="`+employee.pic +`" alt="" class=" rounded image-wrapper">
                //                 </div>
                //             </div>
                //         </div>
                //     </div>
                //     <hr>
                //    </div>`
            });
            div.innerHTML = str;
        }
    };
    xhttp.open("GET", "admin/get_employees", true);
    xhttp.send();
}
load_mc_employees();
function load_docs() {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let table = document.getElementById('doc_table');
            let str = '';
            let docs = JSON.parse(this.responseText).docs;
            docs.reverse().forEach((doc) => {
                str += ` <tr>
            <td>` + doc.title + ` </td>
            <td>` + new Date(parseInt(doc.date)) + `</td>
            <td>` + doc.shop_name + ` </td>
            <td><a href="` + doc.path + `" download><button type="button" class="btn btn-info">Download</button></a></td>
          </tr>`
            });
            table.innerHTML = str;
        }
    };
    xhttp.open("GET", "/docs", true);
    xhttp.send();
}
load_docs();
function load_reports() {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let table = document.getElementById('reports_table');
            let str = '';
            let reports = JSON.parse(this.responseText).reports;
            for(let i = reports.length-1 ; i >=0 ; i--)
            {
                str += ` <tr>
            <td>` + reports[i].title + ` </td>
            <td>` + new Date(parseInt(reports[i].date)) + `</td>
            <td><a href="` + reports[i].path + `" download><button type="button" class="btn btn-info">Download</button></a></td>
          </tr>`
            };
            table.innerHTML = str;
        }
    };
    xhttp.open("GET", "/reports", true);
    xhttp.send();
}
load_reports();

function search_doc() {
    var input, filter, found, table, tr, td, i, j;
    input = document.getElementById("doc_q");
    filter = input.value.toUpperCase();
    table = document.getElementById("doc_table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                found = true;
            }
        }
        if (found) {
            tr[i].style.display = "";
            found = false;
        } else {
            tr[i].style.display = "none";
        }
    }
}

function navigate(loc) {
    document.getElementById("reports_div").style.display = "none";
    document.getElementById("falcon_div").style.display = "none";
    document.getElementById("add_employees_div").style.display = "none";
    document.getElementById("employees_div").style.display = "none";
    document.getElementById("settings_div").style.display = "none";
    document.getElementById("notifications_div").style.display = "none";
    document.getElementById(loc).style.display = "block"

}
function read(id) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let success = JSON.parse(this.responseText).success;
            //alert(success);
        }
    };
    xhttp.open("GET", "/notifications/read/" + id, true);
    xhttp.send();
}
function get_shop(e) {
    let id = e;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let success = JSON.parse(this.responseText).success;
            if (success === true) {
                document.getElementById("specific_shop_div").style.display = 'block';
                // alert(this.responseText);
                //  console.log(this.responseText);
                var shop = JSON.parse(this.responseText).shop;
                var employee_list = JSON.parse(shop.employee_list);
                document.getElementById('specific_shop_name').innerHTML = shop.name;
                document.getElementById('input_shop_id').value = shop._id;
                document.getElementById('s_s_rent').innerHTML = shop.rent;
                let last_date = new Date(parseInt(shop.last_paid));



                let date = new Date().getTime();
                if ((parseInt(shop.last_paid) + (25 * 60 * 60 * 24 * 1000)) < date) {
                    document.getElementById('specific_shop_rent_status').innerHTML = "Due"
                    document.getElementById('specific_shop_rent_status').setAttribute('style', 'color:red');
                }
                else {
                    document.getElementById('specific_shop_rent_status').innerHTML = "Paid"
                    document.getElementById('specific_shop_rent_status').setAttribute('style', 'color:green');


                }


                /////// docs
                table = document.getElementById('s_s_doc_table');
                str = '';
                let docs = JSON.parse(this.responseText).docs;

                docs.reverse().forEach((doc) => {
                    str += ` <tr>
               <td>` + doc.title + ` </td>
               <td>` + new Date(parseInt(doc.date)) + `</td>
               <td><a href="` + doc.path + `" download><button type="button" class="btn btn-info">Download</button></a></td>
             </tr>`
                });


                table.innerHTML = str;
                /////// docs
                document.getElementById('specific_last_paid').innerHTML = last_date;


            }
        }
    };
    xhttp.open("GET", "/admin/shop/get/" + id, true);
    //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();


}

function s_s_search_doc() {
    var input, filter, found, table, tr, td, i, j;
    input = document.getElementById("s_s_doc_q");
    filter = input.value.toUpperCase();
    table = document.getElementById("s_s_doc_table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                found = true;
            }
        }
        if (found) {
            tr[i].style.display = "";
            found = false;
        } else {
            tr[i].style.display = "none";
        }
    }
}