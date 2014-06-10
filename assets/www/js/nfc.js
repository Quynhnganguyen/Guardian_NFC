
function init() {
    document.addEventListener('deviceready', ready, false);
    console.log("init() nfc");
    }
    var id = "",
    payload;   
function showProperty(parent, name, value) {
    console.log("showProperty nfc");
    var dt, dd;
    dt = document.createElement("dt");
    dt.innerHTML = name;
    dd = document.createElement("dd");
    dd.innerHTML = value;
    parent.appendChild(dt);
    parent.appendChild(dd);
}

function clearScreen() {
    console.log("clearScreen nfc");
    document.getElementById("tagContents").innerHTML = "";
}

function showInstructions() {
    console.log("showInstructions nfc");
    // if ($photo) {document.getElementById("imageContent").innerHTML =
    //     '<img id="pic" style="display: none; border: 2px black;"  src=""/>';}
   
    document.getElementById("tagContents").innerHTML =
    "<div id='instructions'>" +
    // " <p align='center'>Hãy quét thẻ!<\/p>" +
    " <p align='center'>Scan tag NFC!<\/p>" +
    " <p><\/p>" +    
    "<\/div>";
}

function onNfc(nfcEvent) {
    console.log("onNfc nfc");
    console.log(JSON.stringify(nfcEvent.tag));
    clearScreen();
    var tag = nfcEvent.tag;    
    var records = tag.ndefMessage || [],
    display = document.getElementById("tagContents");
    
    // Display Tag Info
    var meta = document.createElement('dl');
    display.appendChild(meta);

    if (device.platform.match(/Android/i)) {
        if (tag.id) {
            $nfcid = nfc.bytesToHexString(tag.id);
            $('#tagContents').append('<form id="checkout" style="text-transform: none">'+
                        '<label>Ma the: </label>'+
                        '<input type="text" data-clear-btn="true" name="idtag" id="idtag" value="'+nfc.bytesToHexString(tag.id)+'">'+
                    '</form>') ;
            console.log($nfcid);       
        }             
    }
    navigator.notification.vibrate(100);
}


var ready = function() {
    console.log("ready nfc");
    function win() {
        console.log("or NDEF TaListening fgs");
    }

    function fail(reason) {
        navigator.notification.alert(reason, function() {}, "There was a problem");
    }
    nfc.addNdefListener(
            onNfc,
            function() {
                console.log("Listening for NDEF tags.");
            },
            fail
        );
        
    if (device.platform == "Android") {
        // android launches the app when tags with text/pg are scanned
        // phonegap-nfc fires an ndef-mime event
        // reusing the same onNfc handler
        nfc.addMimeTypeListener(
            'text/pg',
            onNfc,
            function() {
                console.log("Listening for NDEF mime tags with type text/pg.");
            },
            fail
        );

        // read unformatted ndef tags using the same listener
        nfc.addNdefFormatableListener(
            onNfc,
            function() {
                console.log("Listening for unformatted tags.");
            },
            fail
        );
    }
    showInstructions();
};
