document.addEventListener("DOMContentLoaded", function () {
    /* fetch("http://localhost:5000/getAll") */
    /* fetch("http://192.168.0.116:5000/getAll") */
    fetch("/getAll/")
        .then((response) => response.json())
        .then((data) => {
            loadHTMLTable(data["data"]);

            /* INFO: main test local storage  INFO: */
            /* console.log(data["data"][0].id);
            console.log(data["data"][0].name);
            console.log(data["data"][0].date_added); */
            /* localStorage.setItem("test1", data["data"][0].id);
            localStorage.setItem("test2", data["data"][0].name);
            localStorage.setItem("test3", data["data"][0].date_added);
            localStorage.setItem("test0", data["data"][1].name); */
            /* INFO: objektumból tömb  INFO: */
            /* var vnames = [];
            let i = 0;
            for (vname in data["data"][i].name) { */
            //console.log(data["data"][i].name);
            //vnames[i] = data["data"][i].name;
            //console.log(vnames[i]);
            //i++;
            //}
            //
        });
});

document
    .querySelector("table tbody")
    .addEventListener("click", function (event) {
        if (event.target.className === "delete-row-btn") {
            deleteRowById(event.target.dataset.id);
        }
        if (event.target.className === "edit-row-btn") {
            handleEditRow(event.target.dataset.id);
        }
    });

const updateBtn = document.querySelector("#update-row-btn");
const searchBtn = document.querySelector("#search-btn");

searchBtn.onclick = function () {
    const searchValue = document.querySelector("#search-input").value;
    /* INFO: ha a keresés üres sztring  INFO: */
    if (searchValue == "") {
        location.reload();
    }
    fetch("/search/" + searchValue)
        .then((response) => response.json())
        .then((data) => loadHTMLTable(data["data"]));
};

function deleteRowById(id) {
    fetch("/delete/" + id, {
        method: "DELETE",
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                location.reload();
            }
        });
}

function handleEditRow(id) {
    const updateSection = document.querySelector("#update-row");
    updateSection.hidden = false;
    document.querySelector("#update-name-input").dataset.id = id;
}

updateBtn.onclick = function () {
    const updateNameInput = document.querySelector("#update-name-input");

    console.log(updateNameInput);

    fetch("/update/", {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            id: updateNameInput.dataset.id,
            name: updateNameInput.value,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                location.reload();
            }
        });
};

const addBtn = document.querySelector("#add-name-btn");

addBtn.onclick = function () {
    const nameInput = document.querySelector("#name-input");
    const name = nameInput.value;
    nameInput.value = "";

    fetch("/insert/", {
        headers: {
            "Content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ name: name }),
    })
        .then((response) => response.json())
        .then((data) => insertRowIntoTable(data["data"]));
};

function insertRowIntoTable(data) {
    console.log(data);
    const table = document.querySelector("table tbody");
    const isTableData = table.querySelector(".no-data");

    let tableHtml = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === "dateAdded") {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;

    tableHtml += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

function loadHTMLTable(data) {
    const table = document.querySelector("table tbody");

    if (data.length === 0) {
        table.innerHTML =
            "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";

    data.forEach(function ({ id, name, date_added }) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}
