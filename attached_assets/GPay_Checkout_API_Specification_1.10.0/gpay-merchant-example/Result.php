
<html>
<head>
    <title>GPay - Result</title>
</head>
<body>
<?php
    $payload = json_decode(base64_decode(urldecode($_REQUEST['payload'])));
?>

<div>
    <span>payload: </span><br />
    <pre><?php print json_encode($payload, JSON_PRETTY_PRINT); ?></pre>
</div>


</body>
</html>
