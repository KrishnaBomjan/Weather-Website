<?php
include('Krishna Lal Bomjan_2408452_databases.php');
include('Krishna Lal Bomjan_2408452_fetch.php');

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$server = "localhost";
$username = "id21874056_weather";
$password = "24529@Karki";
$db = "id21874056_database";
//$server = "localhost";
//$username = "root";
//$password = "";
//$db = "weather-database";
$connection = connect_database($server, $username, $password, $db);

// Check if the city is provided
$city = (isset($_GET["city"])) ? $_GET["city"] : "Suryapet";

// Fetch current data for the provided city
$data = fetch_current_data($city);
if ($data !== null) {
    // Encode the data into JSON
    $json = json_encode($data, true);

    // Insert data into the database
    insertOrUpdateData($connection, $json);

    // Retrieve weather data from the database
    $weatherData = get_weather_data($connection, $city);

    if ($weatherData !== null) {
        // Prepare a response array
        $response = array(
            "data" => $weatherData
        );
        // Echo the JSON response
        echo json_encode($response);
    } else {
        // Error retrieving weather data
        echo json_encode(array("error" => "Error retrieving weather data."));
    }
} else {
    // Error fetching current data
    echo json_encode(array("error" => "Error fetching current data."));
}

// Close the database connection
$connection->close();
?>