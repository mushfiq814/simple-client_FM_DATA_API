# Same Origin Policy Error trying to request API from same domain.

I am trying to send HTTP Requests to a Middleware API written in PHP using the Slim Framework. I can make requests from Postman as well as my local server using the JS Fetch API. But when I try to access from my domain hosted in WordPress, I get a network timed out error which seems to be related with a CORS Same Origin error.

Domain details:

* My API is hosted in "api.disciplinedmindstutoring.com".
* I am calling that API from "disciplinedmindstutoring.com"


All the other questions that are already present about this topic that I have looked at usually have questions about http vs. https (different origins) or the ``document.domain <iframe>`` method. My question is NOT regarding this. I have the acess control of my server and my domains are already listed there. 

In Chrome Dev console, I get the following:
```
OPTIONS https://api.disciplinedmindstutoring.com/getSubjectsFromCategories net::ERR_CONNECTION_TIMED_OUT
```
However, in the FireFox console, I get more details:

````
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://api.disciplinedmindstutoring.com/getTutorsFromSubjects. (Reason: CORS request did not succeed).
````

Here is the relevant code in my Middleware API that handles CORS requests.

````php
// CORS middleware to allow desired origins developed by Tuupola
$app->add(new \Tuupola\Middleware\Cors([
  "origin" => [
    // Middleware url
    "http://api.disciplinedmindstutoring.com",
    "https://api.disciplinedmindstutoring.com",
    
    // Main Domain also where I am requesting from
    "http://disciplinedmindstutoring.com/",
    "https://disciplinedmindstutoring.com/",

    // local server
    "https://localhost:5500",
    "http://localhost:5500"
  ],
  "methods" => ["POST", "GET", "OPTIONS"],
  "headers.allow" => [
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Origin",
    "Authorization",
    "DM-PROCESS",
  ],
  "headers.expose" => [],
  "credentials" => false,
  "cache" => 0,
]));

$app->add(function($request, $response, $next) {
  $response = $next($request, $response);
  return $response -> withHeader('Content-type', 'application/json');
});
````

Note: The ``DM-PROCESS`` header is an internal header that I provide with each API call. This is already handled within the Middleware API.

The only other relevant question I found here was [this](https://stackoverflow.com/questions/22363268/cross-origin-request-blocked#) which suggested adding the following code to the ``.htaccess`` in WordPress's root directory. I have made the following updates but the problem still persists.

```xml
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>

<FilesMatch "\.(php)$">
  <IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
  </IfModule>
</FilesMatch>

# END WordPress 
```

I have added that and still have not solved my problem. I am wondering if this is a problem with WordPress and how network requests are handled within it. I admit that I am not an expert in setting up an API on a server and went through a lot of difficulty in setting all of this up. 

I apologize if this has already been asked before. If so, please redirect me. I would greatly appreciate any help in pointing me to the right direction. Thank you all very much!