const Url = "https://jsonplaceholder.typicode.com/todos";
const submitButton = document.getElementById("submitButton");
submitButton.addEventListener("click", submitDataToDatabase);
fetchData();

const itemsPerPage = 10;
let currentPage = 1;
let data = [];

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    updateTableVisibility();
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  if (currentPage < Math.ceil(data.length / itemsPerPage)) {
    currentPage++;
    updateTableVisibility();
  }
});

function updateTableVisibility() {
  const tableBody = document.getElementById("tableBody");
  const rows = tableBody.children;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (i >= (currentPage - 1) * itemsPerPage && i < currentPage * itemsPerPage) {
      row.style.display = "table-row";
    } else {
      row.style.display = "none";
    }
  }

  updatePageNumbers();
}

function updatePageNumbers() {
  const pageNumbersElement = document.getElementById("pageNumbers");
  const totalPages = Math.ceil(data.length / itemsPerPage);
  let pageNumbersHtml = "";

  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      pageNumbersHtml += `<span>${i}</span>`;
    } else {
      pageNumbersHtml += `<button onclick="goToPage(${i})">${i}</button>`;
    }
  }

  pageNumbersElement.innerHTML = pageNumbersHtml;
}

function goToPage(page) {
  currentPage = page;
  updateTableVisibility();
  updatePageNumbers();
}

function submitDataToDatabase() {
  const Userid = document.getElementById("userid").value;
  const Id = document.getElementById("id").value;
  const Title = document.getElementById("title").value;
  const Completed = document.getElementById("completed").checked;
  const postData = {
    userId: Userid,
    id: Id,
    title: Title,
    completed: Completed
  };

  fetch(Url, {
    method: "POST",
    body: JSON.stringify(postData),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then((res) => {
      if (res.ok) {
        fetchData();
      } else {
        throw new Error(`HTTP error ${res.status}`);
      }
    })
    .catch((error) => {
      console.error("Error posting data:", error);
    });
}

function fetchData() {
  fetch(Url)
    .then((response) => response.json())
    .then((responseData) => {
      data = responseData;
      addRowsToTable();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function addRowsToTable() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  for (let i = (currentPage - 1) * itemsPerPage; i < currentPage * itemsPerPage; i++) {
    if (data[i]) {
      const item = data[i];
      const newRow = tableBody.insertRow(-1);

      const cell1 = newRow.insertCell(0);
      const cell2 = newRow.insertCell(1);
      const cell3 = newRow.insertCell(2);
      const cell4 = newRow.insertCell(3);
      const cell5 = newRow.insertCell(4);

      cell1.innerHTML = item.id;
      cell2.innerHTML = item.userId;
      cell3.innerHTML = item.title;
      cell4.innerHTML = item.completed;
      cell5.innerHTML = "Actions"; // You can add action buttons here if needed
    }
  }

  updatePageNumbers();
}
