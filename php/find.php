<?php
$conn = new mysqli("localhost:8889", "root", "root", "CSV_DB 5");

if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

$zipCode = htmlspecialchars($_GET['zipcode']);
$type = htmlspecialchars($_GET['type']);
$radius = htmlspecialchars($_GET['radius']);

// Validate radius (should be a number)
if (!is_numeric($radius) || $radius < 0) {
    echo json_encode(['error' => 'Invalid radius format.']);
    exit;
}

$zipCode = mysqli_real_escape_string($conn, $zipCode);
$type = mysqli_real_escape_string($conn, $type);

if ($zipCode) {
    // Validate zipcode (should be 5 digits)
    if (!preg_match('/^\d{5}$/', $zipCode)) {
        echo json_encode(['error' => 'Invalid Zipcode format.']);
        exit;
    }

    $lat_long = getLatLong($zipCode);
    $distance_calc = "(3959 * acos( cos( radians(" . $lat_long['lat'] . ") ) 
                        * cos( radians( latitude ) ) 
                        * cos( radians( longitude ) - radians(" . $lat_long['long'] . ") ) 
                        + sin( radians(" . $lat_long['lat'] . ") ) 
                            * sin( radians( latitude ) ) ) )";
    error_log("Distance calculation formula: " . $distance_calc);
    $distance_val = "$distance_calc AS distance";
    $distance_condition = "$distance_calc <= $radius";
} else {
    $distance_val = "";
    $distance_condition = "1"; // always true
}

$filteredQuery = "
    SELECT *, $distance_val
    FROM npi_df_long_lat
    WHERE $distance_condition
";

$innerQuery = "
    SELECT *,
        PERCENT_RANK() OVER (ORDER BY CAST(tot_count AS UNSIGNED)) * 100 AS tot_percentile,
        PERCENT_RANK() OVER (ORDER BY CAST(cranial_count AS UNSIGNED)) * 100 AS cranial_percentile,
        PERCENT_RANK() OVER (ORDER BY CAST(spinal_count AS UNSIGNED)) * 100 AS spinal_percentile,
        PERCENT_RANK() OVER (ORDER BY CAST(peripheral_count AS UNSIGNED)) * 100 AS peripheral_percentile,
        PERCENT_RANK() OVER (ORDER BY CAST(endovascular_count AS UNSIGNED)) * 100 AS endovascular_percentile,
        RANK() OVER (ORDER BY CAST(cranial_count AS UNSIGNED) DESC) AS cranial_rank,
        COUNT(*) OVER () AS total_results
    FROM ($filteredQuery) AS filtered_data
";

$query = "SELECT * FROM ($innerQuery) AS ranked_data";

if ($type === 'cranial') {
    $query .= " WHERE cranial_percentile > 0";
    $query .= " ORDER BY CAST(cranial_count AS UNSIGNED) DESC";
} elseif ($type === 'spinal') {
    $query .= " WHERE spinal_percentile > 0";
    $query .= " ORDER BY CAST(spinal_count AS UNSIGNED) DESC";
} elseif ($type == 'endovascular') {
    $query .= " WHERE endovascular_percentile > 0";
    $query .= " ORDER BY CAST(endovascular_count AS UNSIGNED) DESC";
} elseif ($type == 'peripheral') {
    $query .= " WHERE peripheral_percentile > 0";
    $query .= " ORDER BY CAST(peripheral_count AS UNSIGNED) DESC";
} else {
    $query .= " ORDER BY CAST(tot_count AS UNSIGNED) DESC";
}

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
function getLatLong($zipCode) {
    $conn = new mysqli("localhost:8889", "root", "root", "CSV_DB 5");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT latitude, longitude FROM zip_df WHERE zip = '$zipCode'";
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