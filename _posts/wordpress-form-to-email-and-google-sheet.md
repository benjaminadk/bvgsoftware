---
type: 'post'
title: 'WordPress Form To Email And Google Sheet'
excerpt: 'Learn how to create your own form that will both email you when submitted and save the data to a Google Sheet. No excessive plugins required. All custom code.'
coverImage: '/assets/blog/wordpress-form-to-email-and-google-sheet/cover.jpg'
date: '2020-08-17'
author:
  name: BVG Software
  picture: '/assets/blog/authors/bvg.jpg'
---

## Intro

So you have your cool WordPress theme and need some kind of form system to collect data and lend a sense of interactivity to the site. Perhaps all you need is a simple contact form that collects an email and a message. Perhaps you need a six section registration form that collects a name, address, phone number, insurance information, job history, emergencies contacts - the list can go on and on.

How should you go about solving this problem?

You could probably find a plugin to solve your problems, which is fine, but could cost money, be excessive, or box you in to doing things a certain way. On the other hand, you could just build your own solution and learn something in the process.

This article will give you an overview, as well as real code that can be used to create a form system for your website. A user will be able to go to your site and fill out a form. Once submitted, the results of the form will be saved to a Google Sheet in your Google Drive and you will receive an email that both notifies you of the form submission, and provides a link to your newly created spreadsheet.

## Environment

This tutorial assumes you have a working WordPress installation and are a developer with a custom or child theme. For those new to WordPress, there are a lot of tutorials out there. You will also need access to the source code to implement this system.

I like using [XAMPP](https://www.apachefriends.org/index.html) as my local development environment for most basic WordPress projects.

As a bonus tip, check out [WPGulp](https://github.com/ahmadawais/WPGulp) to speed up theme development and bundle dependencies.

We will also need [Composer](https://getcomposer.org/) installed on your machine. This is a PHP dependency manager, similar to NPM for NodeJS. Once installed and placed into your `PATH` environment variable, you will be able to use the `composer` command to install stuff.

I am also a big fan of [VS Code](https://code.visualstudio.com/) with the [PHP Inteliphese](https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client) extension. VS Code is a great editor and the extension helps with code suggestions, formatting and more.

## Dependencies

This system requires minimal dependencies to get started.

### WP Mail SMTP

I use a free plugin to handle email distribution. [WP Mail SMTP](https://wordpress.org/plugins/wp-mail-smtp/) can be used with G Suite, SendGrid, and a host of other email providers. Configure this plugin by navigating to its settings page in the WordPress dashboard and following the instructions for your preferred email client. This simply makes the default email service built into WordPress better.

### Google API For PHP

From the root directory of the entire project run `composer require google/apiclient`. This will create a `composer.json` file and a `vendor` folder containing all the Google APIs you will need to work with Sheets and Drive.

## Organization

Technically, this type of email system could easily be consolidated into a plugin of its own, but there is nothing wrong with integrating it straight into a theme.

### HTML Contact Form

This is a form I made for a recent project. I would consider this fairly basic, but useful and appropriate for an introductory tutorial.

<img src='/assets/blog/wordpress-form-to-email-and-google-sheet/contact-form.jpg' alt='Example Contact Form' />

The following code includes [Bootstrap](https://getbootstrap.com/) classes and validation. I decided to leave those on since Bootstrap is fairly common and easy to add to a project.

```html
<form
  class="needs-validation"
  action="<?php echo esc_url(admin_url('admin-post.php')); ?>"
  method="post"
  novalidate="true"
  data-message="Contact Form Submitted"
>
  <div class="form-row">
    <!-- First Name -->
    <div class="form-group col-lg-6">
      <label for="cf-first-name">First Name</label>
      <input
        type="text"
        class="form-control"
        id="cf-first-name"
        name="cf-first-name"
      />
    </div>

    <!-- Last Name -->
    <div class="form-group col-lg-6">
      <label for="cf-last-name">Last Name</label>
      <input
        type="text"
        class="form-control"
        id="cf-last-name"
        name="cf-last-name"
      />
    </div>
  </div>

  <div class="form-row">
    <!-- Phone Number -->
    <div class="form-group col-lg-6">
      <label for="cf-phone">Phone Number</label>
      <input type="tel" class="form-control" id="cf-phone" name="cf-phone" />
    </div>

    <!-- Email -->
    <div class="form-group col-lg-6">
      <label for="cf-email">Email</label>
      <input type="email" class="form-control" id="cf-email" name="cf-email" />
    </div>
  </div>

  <!-- Purpose of Contact -->
  <div class="form-row">
    <div class="form-group col">
      <label for="cf-purpose">How Can We Help?</label>
      <select
        id="cf-purpose"
        class="form-control custom-select"
        name="cf-purpose"
      >
        <option value="" selected>Choose...</option>
        <option value="appointment">Request an Appointment</option>
        <option value="question">Ask a Question</option>
        <option value="other">Other</option>
      </select>
    </div>
  </div>

  <!-- Message -->
  <div class="form-row">
    <div class="form-group col">
      <label for="cf-message">Message</label>
      <textarea
        type="text"
        rows="6"
        class="form-control"
        id="cf-message"
        name="cf-message"
      ></textarea>
    </div>
  </div>

  <!-- Hidden field allows hooking into admin-post.php -->
  <input type="hidden" name="action" value="contact_form" />

  <!-- Submit button -->
  <button
    id="contact-submit-button"
    class="btn btn-success btn-lg btn-block"
    type="submit"
  >
    Submit form
  </button>
</form>
```

The `name` properties are important and will be used to reference values once the form is submitted.

The `hidden` input provides a hook into `admin-post.php` so we can name the form. The value `contact_form` is important and will be used later in WordPress action hooks.

The form itself uses the HTTP method `POST` and PHP to insert the action URL `<?php echo esc_url(admin_url('admin-post.php')); ?>`. This allows us to process the form with code within the WordPress system.

### Bonus: Bootstrap Form Validation

Include the following JavaScript code, to be run on page load, that will activate the [Bootstrap Validation](https://getbootstrap.com/docs/4.5/components/forms/#validation).

```javascript
window.addEventListener(
  'load',
  function () {
    var forms = document.getElementsByClassName('needs-validation')
    Array.prototype.filter.call(forms, function (form) {
      form.addEventListener(
        'submit',
        function (event) {
          if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
          }

          form.classList.add('was-validated')
        },
        false
      )
    })
  },
  false
)
```

### Google Project API Setup

In order to take advantage of the Google Sheets and Google Drive APIs we need to create a project using the [Google Cloud Platform](https://console.cloud.google.com/). If you are using G Suite for your email service, or have used any Google APIs in the past you will be familiar with this interface.

Start by creating a new project and finding the API & Services section. At the top of the page you should see `+ Enable APIs and Services`, which you will click.

<img src='/assets/blog/wordpress-form-to-email-and-google-sheet/enable-google-apis.jpg' alt='Enable Google APIs'>

On the next screen, search for and enable both the Google Sheets and Google Drive APIs.

With these APIs enabled, the next step is to create a credential called a Service Account. Find the Credentials page under the API & Services section and at the top of the screen click `+ Create Credentials`. A dropdown will appear with the Service Account option. Click this!

Name the service account whatever you want.

<img src='/assets/blog/wordpress-form-to-email-and-google-sheet/create-service-account.jpg' alt='Create Service Account'>

On the next screen I have been chosing Project Owner as the role of the Service Account. All other options I have been leaving blank.

Finally, we reach the final details screen. At this point there will be an option to create a JSON key. Do this and you will be prompted to save a file containing your credentials. This isn't something you should be sharing or letting the public have access to. These credentials are required to interact with these powerful Google APIs.

<img src='/assets/blog/wordpress-form-to-email-and-google-sheet/create-json-key.jpg' alt='Create JSON Key'>

The example below is from a dummy account I created so you can see the structure of the file. I like to change the name to `credentials.json` and that is how I will refer to it later in our source code. These credentials are necessary for us to interact with our Google account from within our WordPress backend.

These credentials are safe anywhere on your local machine. You will need to reference the path to this file when we start writing our PHP code. Placing them within your project file structure makes sense. I recommend adding this file to your `.gitignore` if you have one, and if you control your production environment, place these outside of the project file structure or make sure this file cannot be served to the public.

<div class="filename">credentials.json</div>

```json
{
  "type": "service_account",
  "project_id": "leafy-courier-266922",
  "private_key_id": "3ec1c9226a4efeb28eab05bb062b15dda04b404f",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCn9Ug3w7yoH8w7\nkZ1WqZgqaI1ETIHigRLHIK5fe4aG/HSav79dnBBjwmGfCckgzwCDXzBqFxpXT9K5\nyVe96pGHbp2KJlk0oHFCc6NNZuxI9eLFAw0mbUUKSB2j5SqmRjtq6yvfhDDM1aeo\n7zSBIBo2DxEKi+mj4ad3gefUTymjN+NyXMdXfRYoe/ZKvQA82Atyi5T6cqxPqXXi\nSncQdto61FgEJt+gZNfm1YycT+DcampxTVLNHCmzPeJcyxB2Mnq99uXfr1rzQ81t\nCfmoaeWfH2ZqnUHWdVY5fLwRPlM7jVflUNWLhtii5qfFt5pprTZndrN8lks39lhX\n+/PVaUKTAgMBAAECggEADoVUQw33J4noPFYwhiePcksru3Xp3M1P9EtNCBBD5zO4\nWRCu2Mb/W8CYdAmCjAWZg8IdC28H5fiOvWU84rx+7HiRwjniiHw+joI04iI912j6\nvBGxd1sHFwZ5GYxcjZeQ14ORfXeOSIdIQYC8x1UhLv9Kd+D0yChgNCLVCjP145hz\nbBhfvd+hNxAEmafPqPLPS2h4kyRpaEjiaYvRBB+C9iImCakZWQHg9R5ij5WFVhU1\nsGslhel++8aiJmGswFSDc1iL8dGMoLENvqGtb6AFKPlhUiXAVuCB+GZlVxsIFtT8\ndG9C3JbeQYDr38MWexOqDoD5fxLxR0p1Yeb+C5QvEQKBgQDfIF76dvdre9Zj/JRx\nDE+VyhukzAUnvfvWz2bYojp51VtgkJkwXEpy3Ib5kRAzKVG85RrQFI/7AQ2eRTni\nShdlDHzBbMUXJCzwTktYQxxyth80RUDFjN4aJFEnNPlePTVrfCvJip04yypqgykE\nVzQ5y95jJS90v88JWvngu17rnQKBgQDAtCKtDtESMyR1CtGpFvBd4etJBrawAKGp\ncjZd0slilMXbt+hGE/lp3/TEeWXzemns0aYtuzZjDKjnmrFMcaDsUCfabLPvq2j8\nCeWS+BPaD3ijHysI3WMloatG5jFLTAHt+RtRxWANhvzJeS74eHyM0gmhNvD83QLc\nkly2LqIH7wKBgD0aJUhbqdfSWtyYv6HRqD2x0i4n/MVsXnnt5BExI+hXSCXCk2DN\n9UlNIN1ZH2GTUCH1b4lKCD/Jgwwzku1oMs3mRIfHnJWAv5mzJyjtf+3d99+dk2ZF\n9FCeX2boN93ZzzY3E9qmTfXOlTgD4QiiRNgK/0SRW1SSbkT2l/U1+oF1AoGAQUhF\nPw938Ix221fQ81GcGJICnXiyxylPmxHgLSTNqKHx7Z9+Bs+ZfS6rwyvFSBi+bcYQ\nYAm+QQv25I9ZZSZRd/0noy2UP6t4I3pO1d1JDGSVX92dPKGThxof5iLxrCqRtMbh\nZHBTPAHw/Wgaa36V4zb8oCr2tRNCdur2kZl2tu0CgYEAkTTEsB03mGCSHajcz5LS\nXghwAQhpCKqGUOC2hTL5Ug1Dhsg2gzizndXcIJwx1unrqpUapAaAZ+PU6D5Rvrs5\nTnarBIIMVAvfCUf8lX6cwvNdiXaVKXk6axo/7C+auW2zJiWWFMzmzbaQEpRpwvRQ\nnBpqVEBvf8XfmYmpsVqrtjI=\n-----END PRIVATE KEY-----\n",
  "client_email": "whatever@leafy-courier-266922.iam.gserviceaccount.com",
  "client_id": "103024883226673493517",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/whatever%40leafy-courier-266922.iam.gserviceaccount.com"
}
```

### Google Drive Setup

Since we want to save our form submissions as Google Sheet documents inside our Google Drive we need a reference to a folder. To accomplish this create a new folder in your Google Drive. This Drive should be part of the same account that owns the Service Account we created earlier.

This folder will have a unique ID that we will need later in our PHP code. The ID is the long string in the URL.

<img src='/assets/blog/wordpress-form-to-email-and-google-sheet/google-drive-folder.jpg' alt='Create Google Drive Folder' />

Once created, we need to add the email address for the Service Account to the list of users associated with the folder. This is done my opening the Share dialog and pasting in the email address from the `credentials.json` file. This email is also available through the Google Cloud Console.

<img src='/assets/blog/wordpress-form-to-email-and-google-sheet/google-drive-permissions.jpg' alt='Add Service Account To New Folder' />

### PHP Logic

With a lengthy setup complete, the next step is to construct the PHP code that will transform our form into a saved Google Sheet.

The first thing we need to do is bring our `vendor` folder into `functions.php`. Remember, the `vendor` folder holds the Google API code that was brought in with Composer.

Place the following at the top of `functions.php`.

```php
require ABSPATH . '/vendor/autoload.php';
```

To interact with the Google API an instance of `Google Client` is needed. I have abstracted this into its own function, which I have found helpful for organizing projects with more than one form.

The keys here are to request the appropriate scopes and to pass in the path to the `credentials.json` file we saved earlier that represents our Service Account. Simply return the `client` instance.

```php
function get_google_client()
{
	$client = new \Google_Client();
	$client->setApplicationName('Arbitrary Name Here');
	$client->setScopes([\Google_Service_Sheets::SPREADSHEETS, \Google_Service_Drive::DRIVE]);
	$client->setAccessType('offline');
	$client->setAuthConfig('<path to google credentials json file>');
	return $client;
}
```

The following function will be triggered when our Contact Form is submitted using the WordPress `admin.post` - remember the `action` property we set on the form.

I have provided comments and separated the logic into smaller sections.

Note the two WordPress action hooks at the bottom. These use the roots `admin_post_nopriv` and `admin_post` with the `name` property from our hidden form input above attached to the end. There are two hooks to account for both logged in, and non logged in users.

```php
function process_contact_form()
{
		// Sanitize the POST fields and store as variables
		$cfFirstName = sanitize_text_field($_POST["cf-first-name"]);
		$cfLastName = sanitize_text_field($_POST["cf-last-name"]);
		$cfEmail = sanitize_text_field($_POST["cf-email"]);
		$cfPhone = sanitize_text_field($_POST["cf-phone"]);
		$cfPurpose = sanitize_text_field($_POST["cf-purpose"]);
		$cfMessage = sanitize_textarea_field($_POST["cf-message"]);

		// Get Google Client and create service
		$client = get_google_client();
		$service = new Google_Service_Drive($client);

		// Google Drive folder ID where spreadsheet will be saved
		$driveFolderId = 'Google Drive Folder ID Here';
		$mimeType = 'application/vnd.google-apps.spreadsheet';

		// Name file based on patient - use last name first for easy lookup
		$fileName = "$cfLastName, $cfFirstName";

		// Set Drive file properties
		$googleDriveFile = new \Google_Service_Drive_DriveFile();
		$googleDriveFile->setMimeType($mimeType);
		$googleDriveFile->setName($fileName);
		$googleDriveFile->setParents([$driveFolderId]);

		// Create Drive file
		$result = $service->files->create($googleDriveFile);

		// Create Sheets service
		$service = new Google_Service_Sheets($client);

		// Sheet ID used to perform data operations
		$sheet = $service->spreadsheets->get($result->getId());
		$sheetId = $sheet->getSpreadsheetId();

		// URL to be sent in email
		$sheetUrl = $sheet->getSpreadsheetUrl();

		// Sheet properties
		// Range - where to put new data
		$range = 'Sheet1';

		// Values - each array is a row, each item a cell
		// Mirrors the form
		$values = [
			['Contact Form Summary'],
			['Purpose', $cfPurpose],
			['First Name', $cfFirstName],
			['Last Name', $cfLastName],
			['Email', $cfEmail],
			['Phone', $cfPhone],
			['Message', $cfMessage]
		];

		// Place values in value range
		$body = new Google_Service_Sheets_ValueRange([
			'values'  => $values
		]);

		// Specific input as RAW
		$params = [
			'valueInputOption'  => 'RAW'
		];

		// Send to Sheets API to update file created by Drive
		$service->spreadsheets_values->update($sheetId, $range, $body, $params);

    // Generate email content
    // URL will automatically create link and attachment in Gmail
		$to = 'List of Email Addresses Here (comma separated)';
		$subject = 'New Contact Form';
		$message .= '<p>Open the attached Google Sheet to view Contact Form data.</p>';
		$message .= $sheetUrl;
		$headers[] = "Content-Type: text/html; charset=UTF-8";
		$headers[] = "From: Name Here<Email Address Here>";

		// Send to appropriate email and redirect based on success or failure
		if (wp_mail($to, $subject, $message, $headers)) {
			// Redirect to success page
			wp_redirect(get_site_url('Insert ID of Success Page Here'));
		} else {
			// Redirect to error page
			wp_redirect(get_site_url('Insert ID of Error Page Here'));
		}
}

// Add function through WordPress action system
add_action('admin_post_nopriv_contact_form', 'process_contact_form');
add_action('admin_post_contact_form', 'process_contact_form');
```

### Results

With all the preparation and code in place, all that is left to do is fill out the form and submit it. If wired up correctly you should get an email almost immediately.

The Google Sheet created for the example form would look something like the following.

<img src='/assets/blog/wordpress-form-to-email-and-google-sheet/google-sheet-example.jpg' alt='Example Google Sheet' />

## Conclusion

I enjoy working with the form system I have outlined in the article for a number of reasons. Having a hard copy of the data saved to the cloud makes it very easy to organize and share results with coworkers. The system can be implemented for free and doesn't rely on massive plugins. While plugins are helpful, and even essential to WordPress, writing your own code will always allow for more flexibility.

Here are some ideas of where to go from here

- Add reCAPTCHA to prevent bots from submitting spam forms
- Add formatting to improve the look of your Google Sheet
- Expand the system to more complex forms
- Customize the email by adding text and image content
- Breakdown the core function into more reusable parts
- Compile the results of a survey or poll into one master Google Sheet in addition to individual submissions
- Create a settings page in your WordPress admin to control various aspects of the form system - the possibilities are many

Thanks for your time.
