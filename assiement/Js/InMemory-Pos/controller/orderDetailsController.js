function updateOrderDetailsTable() {
    var tableBody = $("#orderDetailsTbl");
    tableBody.empty();

    for (let i = 0; i < placeOrderDB.length; i++) {
        let order = placeOrderDB[i];

        let row = `<tr>
            <td>${order.oderId}</td>
            <td>${order.oderDate}</td>
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