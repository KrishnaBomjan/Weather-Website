<?php
function connect_database($server, $username, $password, $db) {
    $connection = null;
    try {
        $connection = new mysqli($server, $username, $password, $db);

        // Check if the connection was successful
        if ($connection->connect_errno) {
            // Echoing an error message in case of failure
            echo '{"error": "Database connection failed: ' . $connection->connect_error . '"}';
            return null;
        }
        return $connection;
    } catch (Exception $th) {
        echo "connection failed";
        return null;
    }
}

function get_weather_data($connection, $city) {
    try {
        // Prepare a SQL statement with a placeholder for the city
        $stmt = $connection->prepare('SELECT * FROM weather_data WHERE city = ? ORDER BY dt DESC');

        // Check if the statement was prepared successfully
        if ($stmt) {
            // Bind the city as a parameter to the prepared statement
            $stmt->bind_param('s', $city);

            // Execute the prepared statement
            $stmt->execute();

            // Get the result set from the executed statement
            $result = $stmt->get_result();

            // Check if the result set is valid
            if ($result) {
                // Fetch all rows from the result set as an associative array
                $data = $result->fetch_all(MYSQLI_ASSOC);

                // Close the prepared statement
                $stmt->close();

                // Return the fetched data
                return $data;
            } else {
                // Close the prepared statement
                $stmt->close();

                // Return null if the result set is not valid
                return null;
            }
        } else {
            // Return null if the statement was not prepared successfully
            return null;
        }
    } catch (Exception $th) {
        // Return null in case of an exception
        return null;
    }
}

function insertOrUpdateData($connection, $json) {
    // Ensure a valid connection is provided
    if ($connection === null) {
        echo "No valid database connection.";
        return;
    }

    // Decode the JSON data
    $data = json_decode($json, true);

    // Check if decoding was successful
    if ($data === null) {
        return;
    }

    // Extract values from the decoded JSON data
    $temp = $data['main']['temp'];
    $dt = $data['dt'];
    $weather_condition = $data['weather'][0]['main'];
    $iconcode = $data['weather'][0]['icon'];
    $city = $data['name'];
    $pressure = $data['main']['pressure'];
    $humidity = $data['main']['humidity'];
    $wind = $data['wind']['speed'];
    $dayOFweek = date('D');
  // Checking if data already exists in database
  $existingData   = "SELECT * FROM weather_data WHERE city = '$city'  AND dayOFweek = '$dayOFweek'";
  // AND weather_date = '$w_d'
  $result         = mysqli_query($connection, $existingData);
  if (mysqli_num_rows($result)> 0) {
    // Updating data
    $updateData   = "UPDATE weather_data SET temp = '$temp', dt= '$dt', weather_condition = '$weather_condition', iconcode = '$iconcode', pressure = '$pressure',humidity = '$humidity', wind = '$wind'
                      WHERE city = '$city' AND dayOFweek = '$dayOFweek' ";
    if (mysqli_query($connection, $updateData)) {
      //echo "Forecast Data Updated <br>";
    } else {
      echo "Failed to update the forecast data " . mysqli_error($connection);
    }
  } else {
    // Inserting Data
    $insertData   = "INSERT INTO weather_data( temp,dt, weather_condition, iconcode, city, pressure, humidity,wind, dayOFweek)
                      VALUES('$temp', '$dt','$weather_condition','$iconcode','$city','$pressure','$humidity','$wind','$dayOFweek')";
    if (mysqli_query($connection, $insertData)) {
      //echo "Forecast data inserted <br>";
    } else {
      echo "Failed to insert the forecast".mysqli_error($connection);
    }
  }
}