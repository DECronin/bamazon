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
    connection.query("SELECT * FROM products", function(err, res) {
        res.forEach(e => {
            console.log(`ID: ${e.id}) ${e.product_name} || $ ${e.price} /ea | ${e.department_name} | Inventory: ${e.stock_quantity}\n`)
        });
        if (err) throw err;
        promptId(res);
    })
});

function promptId(res){
    inquirer.prompt([{
        type: "number",
        message: "Which Item (by ID#) would you like to purchase?\n",
        name: "itemId"
    }]).then(function(a){
        if (a.itemId > res.length || a.itemId <= 0){
            console.log(`Please select a Valid Product ID.`);
            promptId(res);
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
    console.log(`Pending Reciept:\n==================\n${num} X ${JSON.stringify(res[id])}`)
    // confirm 
    //checkout or restart
}

function checkout(){
    // editing database?
}