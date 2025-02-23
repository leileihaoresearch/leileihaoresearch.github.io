<?php
$conn = new mysqli("localhost:8889", "root", "root", "CSV_DB 5");

if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

$searchZip = isset($_GET['search']) ? $_GET['search'] : '';
$searchZip = mysqli_real_escape_string($conn, $searchZip);
$lat_long = getLatLong($searchZip);

$query = "SELECT *, ( 3959  * acos( cos( radians(" . $lat_long['lat'] . ") ) 
        * cos( radians( latitude ) ) 
        * cos( radians( longitude ) 
        - radians(" . $lat_long['long'] . ") ) 
        + sin( radians(" . $lat_long['lat'] . ") ) 
        * sin( radians( latitude ) ) ) ) 
    AS distance
    FROM npi_df_shortened
    ORDER BY distance ASC
    LIMIT 25;";

$result = $conn->query($query);

if (!$result) {
    echo json_encode(['error' => 'SQL query failed: ' . $conn->error]);
    exit;
}

$data = [];
if ($result && $result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $data[] = $row;
  }
}

header('Content-Type: application/json');
echo json_encode($data);

$conn->close();

// function to get lat and long from zip
function getLatLong($searchZip) {
    $conn = new mysqli("localhost:8889", "root", "root", "CSV_DB 5");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT latitude, longitude FROM zip_df WHERE zip = '$searchZip'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $conn->close();
        return ['lat' => $row['latitude'], 'long' => $row['longitude']];
    } else {
        $conn->close();
        return false;
    }
}
?>