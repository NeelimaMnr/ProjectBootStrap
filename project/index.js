const apiUrl = "https://mock-api-template-rh6s.onrender.com/users";
const dataTable = document.getElementById("dataTable").getElementsByTagName('tbody')[0];
const divPagination = document.getElementById("pagination-container");
let data = [];


function fetchData() {
    fetch(apiUrl)
        .then((response) => response.json())
        .then((responseData) => {
            data = responseData;
            showPage(currentPage);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

window.addEventListener("load", () => {
    fetchData();
});



var itemsPerPage = 10;
var currentPage = 1;
const prevPageButton = document.getElementById("prevPage");
const nextPageButton = document.getElementById("nextPage");
const currentPageSpan = document.getElementById("currentPageSpan");






function createPaginationButtons(totalPages) {
    divPagination.innerHTML = '';
    const prevButton = document.createElement("button");
    prevButton.innerText = "← Previous";
    prevButton.addEventListener("click", () => goToPage(currentPage - 1));
    divPagination.appendChild(prevButton);

    const numButtonsToShow = 3;
    const halfNumButtons = Math.floor(numButtonsToShow / 2);

    for (let i = currentPage - halfNumButtons; i <= currentPage + halfNumButtons; i++) {
        if (i >= 1 && i <= totalPages) {
            const paginationButton = document.createElement("button");
            paginationButton.innerText = i;
            paginationButton.addEventListener("click", () => goToPage(i));
            divPagination.appendChild(paginationButton);
        }
    }

    const nextButton = document.createElement("button");
    nextButton.innerText = "Next →";
    nextButton.addEventListener("click", () => goToPage(currentPage + 1));
    divPagination.appendChild(nextButton);
}

function goToPage(page) {
    if (page >= 1 && page <= Math.ceil(data.length / itemsPerPage)) {
        currentPage = page;
        showPage(currentPage);
    }
}

function calculateTotalPages() {
    return Math.ceil(data.length / itemsPerPage);
}



function showPage(page) {
    
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
   
    dataTable.innerHTML = '';

    
    for (let i = startIndex; i < endIndex && i < data.length; i++) {
        addRowToTable(data[i]);
    }

    createPaginationButtons(calculateTotalPages());

        currentPageSpan.textContent = page;

}


function addRowToTable(data) {
    const newRow = dataTable.insertRow(-1);

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);

    cell1.textContent = data.id;
    cell2.textContent = data.userid;
    cell3.textContent = data.title;
    cell4.textContent = data.completed ? 'Yes' : 'No';

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.borderRadius = "1em";
    deleteButton.className = "delete";
    deleteButton.addEventListener("click", () => deleteData(data.id));
    cell5.appendChild(deleteButton);

    const updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.style.margin = "2px";
    updateButton.style.borderRadius = "1em";
    updateButton.className = "update";
    updateButton.addEventListener("click", () => editRecord(data));
    cell5.appendChild(updateButton);
}


function deleteData(id) {
    fetch(apiUrl + `/${id}`, {
        method: "DELETE",
    })
    .then(() => {
        fetchData(); 
    })
    .catch((error) => {
        console.error("Error deleting data:", error);
    });
}

function editRecord(data){
    document.getElementById("userid").value = data.userid;
    document.getElementById("id").value = data.id;
    document.getElementById("title").value = data.title;
    document.getElementById("completed").checked = data.completed;
}


function updateData(data) {
    console.log('Updating data:', data);

    fetch(apiUrl + `/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
    })
        .then((res) => {
            if (res.ok) {
                console.log('Data updated successfully');
                fetchData();
            } else {
                throw new Error(`HTTP error ${res.status}`);
            }
        })
        .catch((error) => {
            console.error("Error updating data:", error);
        });
}



var submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", submitData);
    const dataForm = document.getElementById("dataForm");


    function submitData() {
        var id = document.getElementById("id").value;
        var userid = document.getElementById("userid").value;
        var title = document.getElementById("title").value;
        var completed = document.getElementById("completed").checked;

        var newData = {
            id: id,
            userid: userid,
            title: title,
            completed: completed,
        };

        
        var existingData = data.find(item => item.id == newData.id);

        if (existingData) {    
            updateData(newData);
        } else {
            
            console.log("newRecordCreated")
            fetch(apiUrl, {
                method: "POST",
                body: JSON.stringify(newData),
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(() => {
                fetchData();
            })
            .catch((error) => {
                console.error("Error posting data:", error);
            });
        }

    
        dataForm.reset();
    }


fetchData();

