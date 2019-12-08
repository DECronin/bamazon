const mysql = require('mysql');
var inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
})

connection.connect(function(err) {
    if (err) throw err;
    renderList();
});

function renderList(){
    connection.query("SELECT * FROM products", function(err, res) {
        console.log(`\nID) Product || Price /ea | Department | Inventory\n--------------------------------------------------`);
        res.forEach(e => {
            console.log(`${e.id}) ${e.product_name} || $ ${e.price} | ${e.department_name} | ${e.stock_quantity}\n`)
        });
        if (err) throw err;
        promptId(res); // if shopping continue option?
    })
}

function promptId(res){
    inquirer.prompt([{
        type: "number",
        message: "Which Item (by ID#) would you like to purchase?\n",
        name: "itemId"
    }]).then(function(a){
        if (a.itemId > res.length || a.itemId <= 0){
            console.log(`Please select a Valid Product ID.`);
            renderList();
        } else {
            promptAmount(res, a.itemId - 1)
        }
    })
}

function promptAmount(res, id){
    inquirer.prompt([{
        type: "number",
        message: "How many you you like us to bundle?\n",
        name: "count"
    }]).then(function(a){
        console.log(a.count);
        if(a.count > res[id].stock_quantity || a.count <= 0){
            console.log('Please choose an appropriate quantity from the availability in Inventory.');
            promptAmount(res, id);
        } else {
            confirmReceipt(res, id, a.count)
        }
    })
}

function confirmReceipt(res, id, num){
    let total = (res[id].price * num * 1.07).toFixed(2);
    console.log(` Pending Reciept:\n===================\n${num} X ${res[id].product_name} @ $${res[id].price}\n-------------------\n   Total: $${total}\n`);
    inquirer.prompt([{
        type: 'confirm',
        message: "",
        default: true,
        name: 'checkout'
    }]).then(function(a){
        if (a.checkout){
            checkout(res, id, num);
        } else {
            renderList();
        }
    })
}

function checkout(res, id, num){
    let q = (parseInt(res[id].stock_quantity) - num);
    id++;
    connection.query("UPDATE products SET ? WHERE ?",[
        {stock_quantity: q},
        {id}    
    ], function(error) {
        if (error) throw err;
        connection.end(
        console.log(`\nThank you!\nYour purchase is now complete.\nPlease come again.\n`)
        )
    })
}