<?php
// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type to JSON for API responses
header('Content-Type: application/json');

// Enable CORS if needed
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration (SQLite for simplicity)
$database_file = 'user_data.db';

// Initialize database
function initDatabase($db_file) {
    try {
        $pdo = new PDO("sqlite:$db_file");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Create users table if it doesn't exist
        $sql = "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )";
        
        $pdo->exec($sql);
        return $pdo;
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        return false;
    }
}

// Validate input data
function validateInput($data) {
    $errors = [];
    
    // Validate name
    if (empty($data['name']) || strlen(trim($data['name'])) < 2) {
        $errors[] = "Name must be at least 2 characters long";
    }
    
    // Validate email
    if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Please enter a valid email address";
    }
    
    // Validate message
    if (empty($data['message']) || strlen(trim($data['message'])) < 10) {
        $errors[] = "Message must be at least 10 characters long";
    }
    
    return $errors;
}

// Sanitize input data
function sanitizeInput($data) {
    return [
        'name' => htmlspecialchars(trim($data['name']), ENT_QUOTES, 'UTF-8'),
        'email' => filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL),
        'message' => htmlspecialchars(trim($data['message']), ENT_QUOTES, 'UTF-8')
    ];
}

// Save user data to database
function saveUserData($pdo, $data) {
    try {
        $sql = "INSERT INTO users (name, email, message) VALUES (:name, :email, :message)";
        $stmt = $pdo->prepare($sql);
        
        $result = $stmt->execute([
            ':name' => $data['name'],
            ':email' => $data['email'],
            ':message' => $data['message']
        ]);
        
        if ($result) {
            return $pdo->lastInsertId();
        }
        return false;
    } catch (PDOException $e) {
        error_log("Database insert error: " . $e->getMessage());
        return false;
    }
}

// Get all users (for admin purposes)
function getAllUsers($pdo) {
    try {
        $sql = "SELECT * FROM users ORDER BY created_at DESC";
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        error_log("Database select error: " . $e->getMessage());
        return false;
    }
}

// Send email notification (mock function)
function sendEmailNotification($data) {
    // In a real application, you would use a proper email service
    // For demonstration, we'll just log the email
    $email_content = "
    New form submission received:
    
    Name: {$data['name']}
    Email: {$data['email']}
    Message: {$data['message']}
    Time: " . date('Y-m-d H:i:s') . "
    ";
    
    error_log("Email notification: " . $email_content);
    return true;
}

// Main processing logic
function processRequest() {
    // Initialize database
    $pdo = initDatabase($GLOBALS['database_file']);
    if (!$pdo) {
        return [
            'success' => false,
            'message' => 'Database connection failed',
            'errors' => ['Database is currently unavailable']
        ];
    }
    
    // Handle different request methods
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'POST':
            return handlePostRequest($pdo);
        case 'GET':
            return handleGetRequest($pdo);
        default:
            return [
                'success' => false,
                'message' => 'Method not allowed',
                'errors' => ['Only POST and GET methods are supported']
            ];
    }
}

// Handle POST requests (form submissions)
function handlePostRequest($pdo) {
    // Get POST data
    $input_data = [
        'name' => $_POST['name'] ?? '',
        'email' => $_POST['email'] ?? '',
        'message' => $_POST['message'] ?? ''
    ];
    
    // Validate input
    $validation_errors = validateInput($input_data);
    if (!empty($validation_errors)) {
        return [
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validation_errors
        ];
    }
    
    // Sanitize input
    $clean_data = sanitizeInput($input_data);
    
    // Save to database
    $user_id = saveUserData($pdo, $clean_data);
    if (!$user_id) {
        return [
            'success' => false,
            'message' => 'Failed to save data',
            'errors' => ['Database error occurred']
        ];
    }
    
    // Send email notification
    sendEmailNotification($clean_data);
    
    // Return success response
    return [
        'success' => true,
        'message' => "Thank you {$clean_data['name']}! Your message has been received.",
        'data' => [
            'user_id' => $user_id,
            'name' => $clean_data['name'],
            'submitted_at' => date('Y-m-d H:i:s')
        ]
    ];
}

// Handle GET requests (view submissions)
function handleGetRequest($pdo) {
    // Check if requesting specific action
    $action = $_GET['action'] ?? 'list';
    
    switch ($action) {
        case 'list':
            $users = getAllUsers($pdo);
            if ($users === false) {
                return [
                    'success' => false,
                    'message' => 'Failed to retrieve data',
                    'errors' => ['Database error occurred']
                ];
            }
            
            return [
                'success' => true,
                'message' => 'Data retrieved successfully',
                'data' => $users,
                'count' => count($users)
            ];
            
        case 'stats':
            try {
                $sql = "SELECT COUNT(*) as total_submissions, 
                               DATE(created_at) as submission_date,
                               COUNT(*) as daily_count
                        FROM users 
                        GROUP BY DATE(created_at) 
                        ORDER BY submission_date DESC 
                        LIMIT 7";
                $stmt = $pdo->query($sql);
                $stats = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                $total_sql = "SELECT COUNT(*) as total FROM users";
                $total_stmt = $pdo->query($total_sql);
                $total = $total_stmt->fetch(PDO::FETCH_ASSOC);
                
                return [
                    'success' => true,
                    'message' => 'Statistics retrieved successfully',
                    'data' => [
                        'total_submissions' => $total['total'],
                        'daily_stats' => $stats
                    ]
                ];
            } catch (PDOException $e) {
                return [
                    'success' => false,
                    'message' => 'Failed to retrieve statistics',
                    'errors' => ['Database error occurred']
                ];
            }
            
        default:
            return [
                'success' => false,
                'message' => 'Invalid action',
                'errors' => ['Supported actions: list, stats']
            ];
    }
}

// Execute the main processing
try {
    $response = processRequest();
    
    // Set appropriate HTTP status code
    http_response_code($response['success'] ? 200 : 400);
    
    // Output JSON response
    echo json_encode($response, JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    // Handle unexpected errors
    error_log("Unexpected error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error',
        'errors' => ['An unexpected error occurred']
    ], JSON_PRETTY_PRINT);
}

// Log request for debugging
error_log("PHP Request processed: " . $_SERVER['REQUEST_METHOD'] . " " . $_SERVER['REQUEST_URI']);
?>
