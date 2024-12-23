document
  .getElementById("userSearchButton")
  .addEventListener("click", function () {
    const searchTerm = document
      .getElementById("userSearch")
      .value.toLowerCase()
      .trim();
    const userRows = document.querySelectorAll("tbody tr");

    userRows.forEach((row) => {
      const username = row.cells[2]?.textContent.toLowerCase() || "";
      const authMethod = row.cells[3]?.textContent.toLowerCase() || "";
      const role = row.cells[4]?.textContent.toLowerCase() || "";

      // Check if any cell contains the search term
      if (
        username.includes(searchTerm) ||
        authMethod.includes(searchTerm) ||
        role.includes(searchTerm)
      ) {
        row.style.display = ""; // Show row
      } else {
        row.style.display = "none"; // Hide row
      }
    });
  });
//////////////
