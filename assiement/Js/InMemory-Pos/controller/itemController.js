// var itemDB = [];
$("#saveItmBtn").click(function () {

    let itemId = $("#txtItemId").val();
    let itemDescription = $("#txtItemDescription").val();
    let itemUnitPrice = $("#txtItemUnitprice").val();
    let itemQty = $("#txtItemQty").val();

    let item = [itemId, itemDescription, itemUnitPrice, itemQty];

    itemModel = {
        id: itemId,
        description: itemDescription,
        unitPrice: itemUnitPrice,
        qty: itemQty
    }

    console.log(itemId, itemDescription, itemUnitPrice, itemQty);

    let row = `<tr>
        <td>${itemId}</td>
        <td>${itemDescription}</td>
        <td>${itemUnitPrice}</td>
        <td>${itemQty}</td>
        </tr>`;

    $("#tblItem").append(row);
    itemDB.push(itemModel);
    clearItemInputFields();
});

//set value to textField
$("#tblItem").on("click", "tr", function () {
    let itemId = $(this).find('td:eq(0)').text();
    let itemDescription = $(this).find('td:eq(1)').text();
    let itemUnitPrice = $(this).find('td:eq(2)').text();
    let itemQty = $(this).find('td:eq(3)').text();

    $("#txtItemId").val(itemId);
    $("#txtItemDescription").val(itemDescription);
    $("#txtItemUnitprice").val(itemUnitPrice);
    $("#txtItemQty").val(itemQty);
});

$('#updateItmBtn').click(function () {
    let id = $("#txtItemId").val();
    updateItem(id);
});


$('#deleteItmBtn').click(function () {
    let id = $("#txtItemId").val();

    let consent = confirm("Do you want to delete.?");
    if (consent) {
        let response = deleteItem(id);
        if (response) {
            alert("Item Deleted");
            getAllItem();
        } else {
            alert("Item Not Removed..!");
        }
    }
});


function deleteItem(id) {
    for (let i = 0; i < itemDB.length; i++) {
        if (itemDB[i].id == id) {
            itemDB.splice(i, 1);
            return true;
        }
    }
    return false;
}


function searchItem(id) {
    return itemDB.find(function (item) {
        return item.id == id;
    });
}


function updateItem(id) {
    if (searchItem(id) == undefined) {
        alert("No such Item..please check the ID");
    } else {
        let consent = confirm("Do you really want to update this item.?");
        if (consent) {
            let item = searchItem(id);
            //if the item available can we update.?

            let itemDescription = $("#txtItemDescription").val();
            let itemUnitPrice = $("#txtItemUnitprice").val();
            let itemQty = $("#txtItemQty").val();

            item.description = itemDescription;
            item.unitPrice = itemUnitPrice;
            item.qty = itemQty;

            getAllItem();
        }
    }

}


function getAllItem() {
    $("#tblItem").empty();

    //get all items
    for (let i = 0; i < itemDB.length; i++) {
        let id = itemDB[i].id;
        let description = itemDB[i].description;
        let unitPrice = itemDB[i].unitPrice;
        let qty = itemDB[i].qty;

        let row = `<tr>
                     <td>${id}</td>
                     <td>${description}</td>
                     <td>${unitPrice}</td>
                     <td>${qty}</td>
                    </tr>`;

        // //and then append the row to tableBody
        $("#tblItem").append(row);

        bindTrEvents();
    }
}


//bind table tr events
function bindTrEvents() {
    $('#tblItem>tr').click(function () {
        //get the selected rows data
        let id = $(this).children().eq(0).text();
        let description = $(this).children().eq(1).text();
        let unitPrice = $(this).children().eq(2).text();
        let qty = $(this).children().eq(3).text();

        //set the selected rows data to the input fields
        $("#txtItemId").val(id);
        $("#txtItemDescription").val(description);
        $("#txtItemUnitprice").val(unitPrice);
        $("#txtItemQty").val(qty);
    })
}


//validation for item
const ItmIdRegex = /^(I00-)[0-9]{3}$/;
const ItmDescriptionRegex = /^[A-Za-z ]{3,}$/;
const ItmUnitpriceRegex = /^[0-9 ]{2,}$/;
const ItmQtyRegex = /^[0-9]{1,}$/;

//add validations set text fields
let itmValidateArray = new Array();
itmValidateArray.push({field: $("#txtItemId"), regEx: ItmIdRegex});
itmValidateArray.push({field: $("#txtItemDescription"), regEx: ItmDescriptionRegex});
itmValidateArray.push({field: $("#txtItemUnitprice"), regEx: ItmUnitpriceRegex});
itmValidateArray.push({field: $("#txtItemQty"), regEx: ItmQtyRegex});

function clearItemInputFields() {
    $("#txtItemId,#txtItemDescription,#txtItemUnitprice,#txtItemQty").val("");
    $("#txtItemId,#txtItemDescription,#txtItemUnitprice,#txtItemQty").css("border", "1px solid #ced4da");
    $("#txtItemId").focus();
    setBtn();
}

setBtn();

//disable tab
$("#txtItemId,#txtItemDescription,#txtItemUnitprice,#txtItemQty").on("keydown keyup", function (e) {
    //get the index number of data input fields indexNo
    let indexNo = itmValidateArray.indexOf(itmValidateArray.find((c) => c.field.attr("id") == e.target.id));

    //Disable tab key
    if (e.key == "Tab") {
        e.preventDefault();
    }

    //check validations
    checkValidations(itmValidateArray[indexNo]);

    setBtn();

    //If the enter key pressed cheque and focus
    if (e.key == "Enter") {

        if (e.target.id != itmValidateArray[itmValidateArray.length - 1].field.attr("id")) {
            //check validation is ok
            if (checkValidations(itmValidateArray[indexNo])) {
                itmValidateArray[indexNo + 1].field.focus();
            }
        } else {
            if (checkValidations(itmValidateArray[indexNo])) {
                saveItem();
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
    for (let i = 0; i < itmValidateArray.length; i++) {
        if (!checkValidations(itmValidateArray[i])) return false;
    }
    return true;
}


function setBtn() {
    $("#deleteItmBtn").prop("disabled", true);
    $("#updateItmBtn").prop("disabled", true);

    if (checkAll()) {
        $("#saveItmBtn").prop("disabled", false);
    } else {
        $("#saveItmBtn").prop("disabled", true);
    }

    let id = $("#txtItemId").val();
    if (searchItem(id) == undefined) {
        $("#deleteItmBtn").prop("disabled", true);
        $("#updateItmBtn").prop("disabled", true);
    } else {
        $("#deleteItmBtn").prop("disabled", false);
        $("#updateItmBtn").prop("disabled", false);
    }

}

