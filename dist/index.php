<head><script defer src="vendors.a06308993a1037314966.bundle.js"></script><script defer src="app.2eb6e2284b743e967736.bundle.js"></script><link href="vendors.css" rel="stylesheet"><link href="app.css" rel="stylesheet"></head><?php 

// include('./index.html') 
$firma = "NOwxb3EHsrpbR80Gh6CdVsrQOm05hi9BmIqul2fz";
$date = date('Ymd');

$file = file_get_contents('./templates/index.html');

$jsCode = '<script>'.
    "var hash = '" . md5($firma.$date) . "';\n".
    "var hdate = '" . $date . "';".
    '</script>';

$file = str_replace( '<script></script>', $jsCode, $file );

// echo '----'."\n";
// echo $jsCode;
// echo '----'."\n";
echo $file;

?>
