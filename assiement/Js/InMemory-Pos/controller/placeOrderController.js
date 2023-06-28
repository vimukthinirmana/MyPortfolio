$(document).ready(function () {
    var currentDate = new Date();
    generateOrderID(); // Generate the initial order ID
    $('#txtdate').val(formatDate(currentDate));

    $('#selectItemID,#selectCusID').click(function () {
        loadAllCustomersId();
        loadAllItemsId();
    });

    clearPlaceOrdInputFields();

});


$('#addCartBtn').click(function () {
    let qtyOnHand = $("#qtyOnHand").val();
    let orderQty = $("#qty").val();

    if ($("#qty").val() != "") {

        if (qtyOnHand > orderQty) {
            alert("This Item Not Available for this Quantity !!!")
        } else {
            updateQty();
            addToCart();
            // loadAllCart();
            calculateTotal();

            // $("#OrderID,#selectCusID,#customerName,#selectItemID,#itemName,#unitPrice,#qtyOnHand,#qty").val("");
        }
    } else {
        alert("please Enter Order Quantity..");
    }

});

function calculateTotal() {
    let total = 0;

    // Iterate over each item in the addCart array
    for (let i = 0; i < addCart.length; i++) {
        let item = addCart[i];
        let itemTotal = parseFloat(item.itemUnitPrice) * parseFloat(item.itemQty);
        total += itemTotal;
    }

    let cartTotal = total;
    $("#txtAllItemTotal").val('Total RS.' + cartTotal + '/-');
}


function updateQty() {
    let qtyOnHand = $('#qtyOnHand').val();
    let order_qty = $('#qty').val();
    let newQtyValue = qtyOnHand - order_qty;

    $('#qtyOnHand').val(newQtyValue);
}

function removeItemInCart() {
    $("#tblAddCart>tr").on('dblclick', function () {
        // $(this).remove();
        $("#tblAddCart").closest('tr').remove();
    });
}

function addToCart() {
    let orderId = $("#OrderID").val();
    // let orderCusId = $("#selectCusID").val();
    let orderCusId = orderCusID;
    let orderCusName = $("#customerName").val();
    let orderDate = $("#txtdate").val();
    // let orderItmId = $("#selectItemID").val();
    let orderItmId = orderItmID;
    let orderItmName = $("#itemName").val();
    let orderItmUnitPrice = $("#unitPrice").val();
    let currentItemQtyOnHand = $("#qtyOnHand").val();
    let orderItmQty = $("#qty").val();

    if (orderCusId === "" || orderCusName === "" || orderItmId === "" || orderItmName === "" || orderItmUnitPrice === "" || currentItemQtyOnHand === "" || orderItmQty === "" || orderItmQty === "0") {
        // At least one field is empty or the quantity is 0
        alert("Fail: Please fill in all fields")
        $("#addCartBtn").prop("disabled", true);
    } else {
        // All fields have values and the quantity is not 0
        console.log("Success to fill all Field");
        $("#addCartBtn").prop("disabled", false);
        // add cart
        let addToCart = [orderId, orderCusId, orderCusName, orderDate, orderItmId, orderItmName, orderItmUnitPrice, orderItmQty];

        addToCartModel = {
            oderId: orderId,
            oderDate: orderDate,
            customerId: orderCusId,
            itemId: orderItmId,
            itemName: orderItmName,
            itemQty: orderItmQty,
            itemUnitPrice: orderItmUnitPrice,
            total: totals = orderItmUnitPrice * orderItmQty
        }

        console.log(orderId, orderDate, orderItmId, orderCusId, orderItmName, orderItmQty, orderItmUnitPrice, totals);

        let row = `<tr>
        <td>${orderId}</td>
        <td>${orderItmId}</td>
        <td>${orderCusId}</td>
        <td>${orderItmName}</td>
        <td>${orderItmQty}</td>
        <td>${orderItmUnitPrice}</td>
        <td>${totals}</td>
        <td><button class="btn btn-danger" id="deleteBtn">Delete</button></td>
        </tr>`;
        $("#tblAddCart").append(row);

        addCart.push(addToCartModel);

        var newRow = $(row);
        newRow.find('#deleteBtn').click(function () {
            removeItemInCart();
        });
    }

}

function placeOrder() {
    // Check if the addCart array is empty
    if (addCart.length === 0) {
        alert("No items in the cart. Please add items before placing an order.");
        return;
    }

    // Save the items to the placeOrderDB array
    placeOrderDB = [...addCart];


    // Check if the items were successfully placed
    if (placeOrderDB.length > 0) {
        // alert("Order placed successfully.");
        includePlaceOrderDetails();
        processTransaction();
        $("#selectCusID,#customerName,#selectItemID,#itemName,#unitPrice,#qtyOnHand,#qty").val("");
        $('#tblAddCart').empty();

        $(document).on('click', '#placeOrderBtn', function () {
            $(this).closest('tr').remove();
        });

        generateOrderID();
    } else {
        alert("Failed to place the order. Please try again.");
    }
}


function processTransaction() {
    // Iterate over the items in the addCart array
    for (let i = 0; i < addCart.length; i++) {
        let item = addCart[i];
        let itemId = item.itemId;
        let itemQty = parseInt(item.itemQty);

        // Find the item in the itemDB array
        let index = itemDB.findIndex((item) => item.id === itemId);
        if (index !== -1) {
            let currentItem = itemDB[index];
            let availableQty = currentItem.qty;

            // Check if the available quantity is sufficient
            if (availableQty >= itemQty) {
                // Subtract the itemQty from the availableQty
                currentItem.qty -= itemQty;

                // Update the total price in the addToCartModel
                item.total = item.itemUnitPrice * itemQty;
            } else {
                // Not enough quantity available
                alert("Insufficient quantity for item with ID: " + itemId);
                return; // Exit the transaction process
            }
        } else {
            // Item not found in itemDB array
            alert("Item with ID: " + itemId + " not found.");
            return; // Exit the transaction process
        }
    }

    // Transaction successful
    alert("Transaction processed successfully.");

    // Clear the addCart array
    addCart = [];
    // Update the order details table
    updateOrderDetailsTable();
}

function updateOrderDetailsTable() {
    var tableBody = $("#orderDetailsTbl");
    tableBody.empty();

    for (let i = 0; i < orderDetailsDB.length; i++) {
        let order = orderDetailsDB[i];

        let row = `<tr>
            <td>${order.oderId}</td>
            <td>${order.orderDate}</td>
            <td>${order.itemId}</td>
            <td>${order.customerId}</td>
            <td>${order.itemName}</td>
            <td>${order.itemQty}</td>
            <td>${order.itemUnitPrice}</td>
            <td>${order.total}</td>
        </tr>`;
        tableBody.append(row);
    }
}


$('#placeOrderBtn').click(function () {
    incrementOrderID();
    placeOrder();

});

var orderIdCount = 1;

// Function to generate the order ID
function generateOrderID() {
    var orderId = 'Ord-' + padNumber(orderIdCount, 3);
    $('#OrderID').css({'color': '#0d6efd', 'font-weight': 'bold'});
    $('#OrderID').val(orderId); // Set the order ID to the text field
}

// Helper function to pad the number with leading zeros
function padNumber(number, length) {
    var str = number.toString();
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}


function incrementOrderID() {
    orderIdCount++;
}

function formatDate(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    return year + '-' + month + '-' + day;
}

/*function populateSelectField() {
    var selectCusField = $('#selectCusID');
    var selectItemField = $('#selectItemID');
    var txtFieldCusName = $('#customerName');
    var txtFieldItmName = $('#itemName');
    var txtFieldItmQtyOnHand = $('#qtyOnHand');
    var txtFieldItmUnitPrice = $('#unitPrice');

    selectCusField.empty();
    selectItemField.empty();

    // Add options for each customer ID
    customerDB.forEach(function(customer, index) {
        var cusOption = $('<option>', {
            value: index,
            text: customer.id
        });

        selectCusField.append(cusOption);
    });

    // Update textField on customer option selection
    selectCusField.change(function() {
        var selectedCusIndex = $(this).val();
        if (selectedCusIndex !== null) {
            var selectedCustomer = customerDB[selectedCusIndex];
            selectCusField.val(selectedCustomer.id); // Set the value of the select field
            selectCusField.find('option:selected').text(selectedCustomer.id); // Set the text of the selected option
            txtFieldCusName.val(selectedCustomer.name);
        }
    });


    // Add options for each item ID
    itemDB.forEach(function(item, index) {
        var itmOption = $('<option>', {
            value: item.id,
            text: item.id
        });

        selectItemField.append(itmOption);
    });

    // Update textField on item option selection
    selectItemField.change(function() {
        var selectedItmIndex = $(this).val();
        if (selectedItmIndex !== null) {
            var selectedItem = itemDB[selectedItmIndex];
            txtFieldItmName.val(selectedItem.name);
            txtFieldItmQtyOnHand.val(selectedItem.qty);
            txtFieldItmUnitPrice.val(selectedItem.unitPrice);
            $("#qty").focus();
        }
    });
}*/


function loadAllCustomersId() {
    $('#selectCusID').empty();
    $('#selectCusID').prepend('<option>Select CustomerID</option>');
    for (let customer of customerDB) {
        $('#selectCusID').append(`<option>${customer.id}</option>`);
    }
}

function loadAllItemsId() {
    $('#selectItemID').empty();
    $('#selectItemID').prepend('<option>Select ItemID</option>');
    for (let item of itemDB) {
        $('#selectItemID').append(`<option>${item.id}</option>`);
    }
}


$('#selectCusID').change(function () {
    let cusID = $('#selectCusID').val();
    let customer = searchCustomerForInputField(cusID);
    if (customer != null) {
        console.log(cusID);
        orderCusID = cusID;
        $('#selectCusID').val(cusID);
        $('#customerName').val(customer.name);
    }

});

$('#selectItemID').change(function () {
    let itmID = $('#selectItemID').val();
    let item = searchItemForInputField(itmID);
    if (item != null) {
        console.log(itmID);
        orderItmID = itmID;
        $('#selectItemID').val(itmID);
        $('#itemName').val(item.name);
        $('#qtyOnHand').val(item.qty);
        $('#unitPrice').val(item.unitPrice);
        $("#qty").focus();
    }

});
var orderCusID;
var orderItmID;

function searchCustomerForInputField(cusId) {

    for (let customer of customerDB) {
        if (customer.id == cusId) {
            return customer;
        }
    }
    return null;
}

function searchItemForInputField(itmID) {

    for (let item of itemDB) {
        if (item.id == itmID) {
            return item;
        }
    }
    return null;
}


function includePlaceOrderDetails() {

    // Include all placeOrderDB arrays into orderDetailsDB
    for (let i = 0; i < placeOrderDB.length; i++) {
        let order = placeOrderDB[i];

        let orderDetails = {
            oderId: order.oderId,
            orderDate: order.orderDate,
            customerId: order.customerId,
            itemId: order.itemId,
            itemName: order.itemName,
            itemQty: order.itemQty,
            itemUnitPrice: order.itemUnitPrice,
            total: order.total
        };

        orderDetailsDB.push(orderDetails);
    }
}

// Call the includePlaceOrderDetails function when needed


//validation
const PlaceOrdQtyRegex = /^[0-9]{1,}$/;
let placeOrdValidateArray = new Array();

placeOrdValidateArray.push({field: $("#qty"), regEx: PlaceOrdQtyRegex});

function clearPlaceOrdInputFields() {
    $("#qty").val("");
    $("#qty").css("border", "1px solid #ced4da");
    setBtn();
}

setBtn();

$("#qty").on("keydown keyup", function (e) {
    //get the index number of data input fields indexNo
    let indexNo = placeOrdValidateArray.indexOf(placeOrdValidateArray.find((c) => c.field.attr("id") == e.target.id));

    //Disable tab key
    if (e.key == "Tab") {
        e.preventDefault();
    }

    //check validations
    checkValidations(placeOrdValidateArray[indexNo]);

    setBtn();

    //If the enter key pressed cheque and focus
    if (e.key == "Enter") {

        if (e.target.id != placeOrdValidateArray[placeOrdValidateArray.length - 1].field.attr("id")) {
            //check validation is ok
            if (checkValidations(placeOrdValidateArray[indexNo])) {
                placeOrdValidateArray[indexNo + 1].field.focus();
            }
        } else {
            if (checkValidations(placeOrdValidateArray[indexNo])) {

            }
        }
    }
});

function checkValidations(object) {
    if (object.regEx.test(object.field.val())) {
        setBorder(true, object)
        return true;
    }
    setBorder(false, object)
    return false;
}

function setBorder(bol, ob) {
    if (!bol) {
        if (ob.field.val().length >= 1) {
            ob.field.css("border", "2px solid red");
        } else {
            ob.field.css("border", "1px solid #ced4da");
        }
    } else {
        if (ob.field.val().length >= 1) {
            ob.field.css("border", "2px solid green");
        } else {
            ob.field.css("border", "1px solid #ced4da");
        }
    }
}

function checkAll() {
    for (let i = 0; i < placeOrdValidateArray.length; i++) {
        if (!checkValidations(placeOrdValidateArray[i])) return false;
    }
    return true;
}

function setBtn() {
    $("#addCartBtn").prop("disabled", true);

    if (checkAll()) {
        $("#addCartBtn").prop("disabled", false);
    } else {
        $("#addCartBtn").prop("disabled", true);
    }

}
