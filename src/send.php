<?php


require 'vendor/autoload.php';
// reference the Dompdf namespace
use Dompdf\Dompdf;


//Instantiation and passing `true` enables exceptions
// $mail = new PHPMailer(true);
$msg = "Contenido automático no responda a este correo

Le enviamos adjunto un PDF con la puntuación y resultados del alumnado para la aplicación Aritmates. Tenga en cuenta que solo se muestran los ejercicios que el alumnado ha resuelto de forma incorrecta.

Reciba un cordial saludo.

Este correo electrónico, y en su caso, cualquier fichero anexo al mismo, contiene información confidencial y es de uso exclusivo de la persona destinataria, quedando prohibida su divulgación, copia o distribución a terceras personas sin la autorización expresa de la remitente. Si ha recibido este mensaje por error, se ruega lo notifique a la persona remitente y proceda a borrarlo de su sistema. Gracias por su colaboración.";

$html = "
<p>Contenido automático no responda a este correo</p>
<p>
Le enviamos adjunto un PDF con la puntuación y resultados del alumnado para la aplicación Aritmates. Tenga en cuenta que solo se muestran los ejercicios que el alumnado ha resuelto de forma incorrecta.
</p><p>
Reciba un cordial saludo.</p>
<p style='font-size:8pt'>
Este correo electrónico, y en su caso, cualquier fichero anexo al mismo, contiene información confidencial y es de uso exclusivo de la persona destinataria, quedando prohibida su divulgación, copia o distribución a terceras personas sin la autorización expresa de la remitente. Si ha recibido este mensaje por error, se ruega lo notifique a la persona remitente y proceda a borrarlo de su sistema. Gracias por su colaboración.</p>";


function mostrarInsignias( $puntuacion ) {

    $maximo = 10;
    if ( $puntuacion == 0 ) return;
    $css = ' ';

    if ( $puntuacion/$maximo > 0 ) {
        $css .= '#ejercicios #rowInsignia .circulo.mini.bronze { 
            display: inline;
            margin-right:10px }'."\n";
    }

    if ( $puntuacion/$maximo > 0.25) {
        $css .= '#ejercicios #rowInsignia .circulo.mini.silver { 
            display: inline;
            margin-right:10px }'."\n";
    }
    if ( $puntuacion/$maximo > 0.5) {
        $css .= '#ejercicios #rowInsignia .circulo.mini.gold { 
            display: inline;
            margin-right:10px }'."\n";
    }
    if ( $puntuacion/$maximo > 0.75) {
        $css .= '#ejercicios #rowInsignia .circulo.mini.platinum { 
            display: inline;
            margin-right:10px }'."\n";
    }
    if ( $puntuacion/$maximo == 1) {
        $css .= '#ejercicios #rowInsignia .circulo.mini.perfect { 
            display: inline;
            margin-right:10px }'."\n";
    }
    return $css;
}
function mostrarInsigniasTiempo( $tiempoGastado, $maximo ) {
    $css = '';
    if ( $tiempoGastado == $maximo ) return;
    if ( $maximo == '0' || $maximo == 0 || !isset($maximo) ) return;
    if ( !isset($tiempoGastado)) return;
    if ( $tiempoGastado/$maximo > 0.75 ) {
        $css .= '#ejercicios #rowVelocidad .circulo.mini.bronze { 
            display: inline;
            margin-right:10px } ';
    }
    if ( $tiempoGastado/$maximo > 0.5 ) {
        $css .= '#ejercicios #rowVelocidad .circulo.mini.silver { 
            display: inline;
            margin-right:10px } ';
    }
    if ( $tiempoGastado/$maximo > 0.25 ) {
        $css .= '#ejercicios #rowVelocidad .circulo.mini.gold { 
            display: inline;
            margin-right:10px } ';
    }
    if ( $tiempoGastado/$maximo > 0.0 ) {
        $css .= '#ejercicios #rowVelocidad .circulo.mini.platinum { 
            display: inline;
            margin-right:10px } ';
    }
    return $css;
}

if (isset($_POST) && isset($_POST['hashfirma'])) {


        // Imagenes:
        $imagenInsigia = '<img src="img/pdf/insigniaGrande.png" >';
        $imagenInsigiaA = '<img src="img/pdf/insigniaA.png" >';
        $imagenInsigiaB = '<img src="img/pdf/insigniaB.png" >';
        $imagenInsigiaC = '<img src="img/pdf/insigniaC.png" >';
        $imagenInsigiaD = '<img src="img/pdf/insigniaD.png" >';
        $imagenInsigiaE = '<img src="img/pdf/insigniaE.png" >';

        $imagenCohete = '<img src="img/pdf/cohetegrande.png" >';
        $imagenCoheteA = '<img src="img/pdf/coheteA.png" >';
        $imagenCoheteB = '<img src="img/pdf/coheteB.png" >';
        $imagenCoheteC = '<img src="img/pdf/coheteC.png" >';
        $imagenCoheteD = '<img src="img/pdf/coheteD.png" >';

        $imagenEstrella = '<img src="img/pdf/estrellaGrande.png" >';
        $imagenPencil  = '<img src="img/pdf/pencil.png" >';
        $imagenPortapapeles = '<img src="img/pdf/portapapeles.png" >';
        $imagenThumbup = '<img src="img/pdf/thumbup.png" >'; 
        $imagenThumbdown = '<img src="img/pdf/thumbdown.png" >';
        $imagenChrono = '<img src="img/pdf/chrono.png" >';

        $score = json_decode($_POST['score']);
        $ejerciciosTotal = 10;
        $aciertos = $score->aciertos;
        $fallos =  $score->fallos;
        $ejerciciosCompletados =  $score->completados;
        $tiempoConsumido = $_POST['tiempoConsumido'];

        
        // $comentario = str_replace("\n","<br>", $_POST['comentario']) ;
        
        $mostrarInsigniasTiempo = true;
        if ( isset($_POST['tiempoTotal']) && is_string($_POST['tiempoTotal']) && $_POST['tiempoTotal'] != '')
            $tiempoTotal = $_POST['tiempoTotal'];
        else {
            $tiempoTotal = '--:--';
            $mostrarInsigniasTiempo = false;
        }
        $tiempoMedio = $_POST['tiempoMedia'];
        //  || '--:--';

        $resultados = '<html><head><title>Resultados</title>';
    
        $matches = glob('./ap*.css');

        if ( is_array($matches) && count($matches)>0){
            // echo "count matches ". count($matches);
            foreach ($matches as $key => $value) {
                $css = file_get_contents($value);
                $resultados .= '<style>'.$css.'</style>';
                // $resultados .= '<link rel="stylesheet" href="'.$value.'">';
            }            
        }

        $resultados .= '<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap" rel="stylesheet">';
   

        $resultados .= '<style>
        #ejercicios .circulo.mini { 
            display: none 
        }
        #ejercicios .circulo.mini img {
            --diametro: 30px;
            width: var(--diametro);
            height: var(--diametro);
            border
        }

        #ejercicios .circulo.mini.platinum img {
            background-color: $platinum;
            --diametro: 50px;
        }
        #ejercicios .circulo.mini.perfect img {
            background-color: $platinum;
            --diametro: 100px;
        }
        #ejercicios, body.pdf, .pdf, .pdf h3, *,td,
        #ejercicios #tablaEstadisticas, #ejercicios #tablaPuntuacion
        { 
            font-family: \'Roboto\', sans-serif !important;
        }
        ';
        $resultados .= mostrarInsignias( $_POST['puntuacion'] );
        if ( $mostrarInsigniasTiempo )
            $resultados .= mostrarInsigniasTiempo( $score->tiempoConsumido, $_POST['tiempoTotalMilis']);
        else {
            $resultados .= '#ejercicios #rowVelocidad { display: none }';
        }
        $resultados .= "</style>";


        $resultados .= '<style>
            body, .forcefont {
                font-size: 12pt;
                font-family: Roboto, serif ;
            }

            .info {
                text-align: left;
            }
            .info h3 { 
                font-size: 13pt;
            }

            table { width: 100%; }
            .title, .circulo, .material-icons { display: none; }        
            #paper .title { display: block; }
            #ejercicios .circulo.mini img {
                width: 25px;
            }
            #ejercicios .circulo.mini.silver,
            #ejercicios .circulo.mini.gold,
            #ejercicios .circulo.mini.bronze,
            #ejercicios .circulo.mini.platinum,
            #ejercicios .circulo.mini.perfect,
            #ejercicios .circulo.mini {
                background-color: transparent 
                border: none;
            }
            #tablaPuntuacion {
                font: 400 16px/30px \'Roboto\';
            }
            h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6{
                font-weight: 400;
            }
            .sharpbox table th {
                font: 400 14px/30px \'Roboto\'
            }
            .break{
                page-break-after: allways;
            }
        </style>';

        $resultados .= '</head><body id="ejercicios" class="pdf" >';
        $cabecera = '
            <div id="paper" >
                <div class="title" style="width:100%;position:relative" >
                    <img src="img/logo_gobierno_canarias.png" alt="gobierno de canarias">
                    <img style="float: right;" src="img/pdf/logoAritmates.png" alt="aritmates">          
                </div>
            </div>
        ';
        
        $resultados .= $cabecera;
        $resultados .= '<div id="interior">';
        $resultados .= '<div class="operationZone">';


        $resultados .= "<div class='info'><h2>Resultados obtenidos</h2><hr></div>";

        $htmlTablaInsignias = '
            <table id="tablaPuntuacion">
                <tr id="rowPuntuacion">
                    <td class="forcefont" >
                        <span style="font-face:Roboto" > Puntuación </span>
                    </td>
                    <td>
                        '.$imagenEstrella.'
                    </td>
                    <td class="puntos">
                            <span id="puntuacion">'.$_POST['puntuacion'].'</span>
                    <td>
                </tr>
                <tr id="rowInsignia">
                    <td class="forcefont"> Tu Insignia </td>
                    <td>
                        '.$imagenInsigia.'
                    </td>
                    <td class="puntos">
                        <span class="circulo mini bronze" > '. $imagenInsigiaA .' </span>
                        <span class="circulo mini silver" > '. $imagenInsigiaB .' </span>
                        <span class="circulo mini gold" > '. $imagenInsigiaC .' </span>
                        <span class="circulo mini platinum" > '. $imagenInsigiaD .' </span>
                        <span class="circulo mini perfect" > '. $imagenInsigiaE .' </span>
                        <!--
                        <div class="circulo mini bronze"  > '.$imagenInsigiaA.' </div>
                        <div class="circulo mini silver"  > '.$imagenInsigiaB.' </div>
                        <div class="circulo mini gold"    > '.$imagenInsigiaC.' </div>
                        <div class="circulo mini platinum"> '.$imagenInsigiaD.' </div>
                        <div class="circulo mini perfect" > '.$imagenInsigiaE.' </div> 
                        -->
                    <td>
                </tr>
                <tr id="rowVelocidad">
                    <td class="forcefont">
                        Insignia Extra
                    </td>
                    <td>
                        '.$imagenCohete.'
                    </td>
                    <td class="puntos">
                        <span id="insigniaVelocidad"> </span> 
                        <span class="circulo mini bronze" > '.$imagenCoheteA.'</span>
                        <span class="circulo mini silver" > '.$imagenCoheteB.'</span>
                        <span class="circulo mini gold" > '.$imagenCoheteC.'</span>
                        <span class="circulo mini platinum" > '.$imagenCoheteD.'</span>
                        <!--
                        <div class="circulo mini bronze"  > '.$imagenCoheteA.' </div>
                        <div class="circulo mini silver"  > '.$imagenCoheteB.' </div>
                        <div class="circulo mini gold"    > '.$imagenCoheteC.' </div>
                        <div class="circulo mini platinum"> '.$imagenCoheteD.' </div>
                        -->
                    <td>
                </tr>
            </table>
        ';

        $resultados .= $htmlTablaInsignias;
        
        if ( !isset($tiempoTotal) ) $tiempoTotal = '';
        if ( empty($tiempoTotal)  ) $tiempoTotal = '';
        if ( $tiempoTotal === 'undefined' ) $tiempoTotal = '';
        
        $htmlTablaEstadisticas = '<table id="tablaEstadisticas">
                    <tr>
                        <td> Ejercicios completados </td>
                        <td> '.$imagenPortapapeles.' </td>
                        <td> <span class="score"> 
                            <span id="ejerciciosCompletados">'.$ejerciciosCompletados.'</span> / 
                            <span id="ejerciciosTotal">'.$ejerciciosTotal.'</span></span> <td>
                    </tr>
                    <tr>
                        <td> Aciertos </td>
                        <td> '.$imagenThumbup.' </td>
                        <td> <span class="score"> <span id="aciertos">'.$aciertos.'</span> </span> <td>
                    </tr>
                    <tr>
                        <td> Fallos </td>
                        <td> '.$imagenThumbdown.' </td>
                        <td> <span class="score"> <span id="fallos">'.$fallos.'</span> </span> <td>
                    </tr>
                    <tr>
                        <td> Tiempo consumido </td>
                        <td> '.$imagenChrono.' </td>
                        <td> 
                            <span class="score">
                                <span id="tiempoConsumido">'.$tiempoConsumido.'</span>
                                <span id="tiempoSeparador"> | </span>
                                <span id="tiempoTotal">'.$tiempoTotal.'</span>
                            </span> 
                        <td>
                    </tr>
                    <tr>
                        <td> Media por ejercicio </td>
                        <td> '.$imagenChrono.' </td>
                        <td> <span class="score"> <span id="tiempoMedio">'.$tiempoMedio.'</span> </span> <td>
                    </tr>
                </table>';

        $resultados .= '<hr>';
        $resultados .= $htmlTablaEstadisticas;
        $resultados .= '<br class="brueak" > ';
        $resultados .= '<h3 class="forcefont" >Correcciones</h3>';        

        $correciones = str_replace( '∙','*', $_POST['correcciones'] );
        $resultados .= $correciones;

        // $resultados .= '<hr>';
        $resultados .= '</div>'; //fin .operationzone        
        $resultados .= '</div>';// fin #interior
        $resultados .= '</body>';

        // instantiate and use the dompdf class
        $dompdf = new Dompdf();
        $dompdf->loadHtml($resultados);

        // (Optional) Setup the paper size and orientation
        $dompdf->setPaper('A4', 'portrait');

        // Render the HTML as PDF
        $dompdf->render();
        $output = $dompdf->output();

        // Definir las cabeceras para la descarga
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="AritmatesEjercicio.pdf"');

        // Enviar el contenido PDF al navegador
        echo $output;
        
    // } 
}
