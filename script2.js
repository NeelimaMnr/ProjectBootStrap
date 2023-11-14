
    var Url="";
    var submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", submitDataToDatabase);


    function fetchData() {
        fetch(Url)
        .then((response) => response.json())
        .then((data) => {
            var tabledata1 = document.querySelector(".tabledata1");
                var tableRows = tabledata1.querySelectorAll("tr"); // Select all rows except the first one (heading row)
            for (var i = 1; i < tableRows.length; i++) {
                tableRows[i].remove(); // Remove all rows except the first one
            }
            data.forEach((item) => {
                addRowToTable(item);
            });
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
    }
 

fetch(Url)
    .then((response) => response.json())
    .then((fetchedData) => {
        data = fetchedData;
        fetchData();
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });



    function submitDataToDatabase() {
        var updateId = document.getElementById("updateId").value;
        var userid = document.getElementById("userid").value;
        var id = document.getElementById("id").value;
        var title = document.getElementById("title").value;
        var completed = document.getElementById("completed").checked;
        var data = {
            userid: userid,
            id: id,
            title: title,
            completed: completed
        };
    
        if (updateId) {
            updateRecord(updateId, data);
        } else {
            sendData(data);
        }

        document.getElementById("updateId").value = "";
        document.getElementById("userid").value = "";
        document.getElementById("id").value = "";
        document.getElementById("title").value = "";
        document.getElementById("completed").checked = false;
    }
    


    function sendData(data){
    fetch(Url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res=>
          {if(res.ok)
            addRowToTable(data)
       fetchData();
    })
    .catch((error) => {
        console.error("Error posting data:", error);
    });
    }

function updateRecord(id, data) {
    fetch(Url + `/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    })
        .then((res) => {
            if (res.ok) {
                fetchData();
            } else {
                throw new Error(`HTTP error ${res.status}`);
            }
        })
        .catch((error) => {
            console.error("Error updating data:", error);
        });
}


function addRowToTable(data) {
    var tabledata1 = document.querySelector(".tabledata1");

    var newRow = tabledata1.insertRow(-1);

    var div = document.createElement("div");
    
    div.style.display = "inline-block";

    div.style.margin = "5px 40px 5px 0px";


    var Delete = document.createElement("button");
    Delete.innerHTML = "Delete";
    div.appendChild(Delete);
    Delete.addEventListener("click", function () 
    {
        deleteData(newRow,data);
    });

    Delete.style.width = "55px";
    Delete.style.backgroundColor = "#e73333";


    var Update = document.createElement("button");
    Update.innerHTML = "Update";
    div.appendChild(Update);
    Update.addEventListener("click", function () {
        editRecord(data);
    });

    Update.style.width = "55px";
    Update.style.marginTop= "5px";
    Update.style.backgroundColor = "#2193b0";
    

    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    var cell4 = newRow.insertCell(3);
    var cell5 = newRow.insertCell(4);
    cell1.innerHTML = data.id;
    cell2.innerHTML = data.userid;
    cell3.innerHTML = data.title;
    cell4.innerHTML = data.completed;
    cell5.appendChild(div);
}



function editRecord(data){
    document.getElementById("updateId").value = data.id;
    document.getElementById("userid").value = data.userid;
    document.getElementById("id").value = data.id;
    document.getElementById("title").value = data.title;
    document.getElementById("completed").checked = data.completed;
}


function deleteData(row, data) {
    fetch(Url+"/" + data.id, {
        method: "DELETE",
    })
    .then(() => {
        var tabledata1 = document.querySelector(".tabledata1");
        tabledata1.deleteRow(row.rowIndex);
    })
    .catch((error) => {
        console.error("Error deleting data:", error);
    });
}
