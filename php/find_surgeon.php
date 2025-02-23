<?php
$servername = "localhost:8889";
$username = "root";
$password = "root"; // found in /Applications/MAMP/bin/phpMyAdmin5/config.inc.php
$dbname = "CSV_DB 5";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Get the search term from the query parameter
$searchNpi = isset($_GET['search']) ? $_GET['search'] : '';

// Sanitize the input to prevent SQL injection (VERY IMPORTANT!)
$searchNpi = mysqli_real_escape_string($conn, $searchNpi); // Or use prepared statements (recommended)

// Construct the SQL query
$sql = "SELECT * FROM npi_df WHERE `COL 1` LIKE '%" . $searchNpi . "%'";

$result = $conn->query($sql);

$data = array();
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $data[] = $row;
  }
}

header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>