<?php
  /**
  * Requires the "PHP Email Form" library
  * The "PHP Email Form" library is available only in the pro version of the template
  * The library should be uploaded to: vendor/php-email-form/php-email-form.php
  * For more info and help: https://bootstrapmade.com/php-email-form/
  */

  // Replace contact@example.com with your real receiving email address
  // Updated to use the verified email present in the project files.
  $receiving_email_address = 'nicklasodayo@gmail.com';

  if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php' )) {
    include( $php_email_form );
  } else {
    // Fallback: attempt to send using PHP mail() if available. This may not be reliable on all hosts.
    $name = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
    $email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_VALIDATE_EMAIL) : false;
    $subject = isset($_POST['subject']) ? strip_tags(trim($_POST['subject'])) : 'Website contact form';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    $body = "Name: {$name}\nEmail: {$email}\n\nMessage:\n{$message}";
    $safe_from = $email ? $email : 'noreply@' . ($_SERVER['SERVER_NAME'] ?? 'localhost');
    $headers = "From: {$name} <{$safe_from}>\r\n" .
               "Reply-To: {$safe_from}\r\n" .
               "Content-Type: text/plain; charset=UTF-8\r\n";

    if (function_exists('mail') && mail($receiving_email_address, $subject, $body, $headers)) {
      echo 'OK';
    } else {
      // Informational message for the developer / site owner
      echo 'ERROR: Mailer not configured. Install the PHP Email Form library or configure SMTP on the server.';
    }
    exit;
  }

  $contact = new PHP_Email_Form;
  $contact->ajax = true;
  
  $contact->to = $receiving_email_address;
  $contact->from_name = $_POST['name'];
  $contact->from_email = $_POST['email'];
  $contact->subject = $_POST['subject'];

  // Uncomment below code if you want to use SMTP to send emails. You need to enter your correct SMTP credentials
  /*
  $contact->smtp = array(
    'host' => 'example.com',
    'username' => 'example',
    'password' => 'pass',
    'port' => '587'
  );
  */

  $contact->add_message( $_POST['name'], 'From');
  $contact->add_message( $_POST['email'], 'Email');
  isset($_POST['phone']) && $contact->add_message($_POST['phone'], 'Phone');
  $contact->add_message( $_POST['message'], 'Message', 10);

  echo $contact->send();
?>
