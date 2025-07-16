<?php
    require_once("Security.php");
?>

<html>
<head>
    <title>GPay - Payment Form Example</title>
</head>
<body>
<?php
$params = [];
foreach($_REQUEST as $name => $value) {
    $params[$name] = $value;
}
?>

<form id="payment-confirmation" action="<?php echo BASE_URL; ?>/v1/checkout" method="post">
    <fieldset id="confirmation">
        <legend>Review Payment Details</legend>
        <div>
            <?php
                foreach($params as $name => $value) {
                    echo "<div style='border-bottom: black 1px solid; margin-bottom: 5px'>";
                    echo "<span class='fieldName' style='font-weight: bold'>" . "$name: " . "</span><span class=\"fieldValue\">" . $value . "</span>";
                    echo "</div>\n";
                }
            ?>
        </div>
    </fieldset>
    <?php
        foreach($params as $name => $value) {
            echo "<input type='hidden' name='$name' value='$value' />";
        }
        $signature = generateSignature($params);
        echo "<input type='hidden' name='signature' value='$signature' />";
    ?>
    <button type="submit">Confirm</button>
</form>
</body>
</html>
