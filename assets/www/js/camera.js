var settings;

// Class representing a storage of cameraOptions (optional parameters to customize the camera settings) 
// with which camera.getPicture() is called
// See http://docs.phonegap.com/en/2.0.0/cordova_camera_camera.md.html for cameraOptions description
function Settings() {
    
    // Opening options:
    if ((typeof Camera !== "undefined")) {
        
        this.destinationType = Camera.DestinationType.FILE_URI;     // cameraOptions: destinationType
        this.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;    // cameraOptions: sourceType
        this.mediaType = Camera.MediaType.PICTURE;                  // cameraOptions: mediaType
    }
    
    // Photo quality and editing options:
    this.quality = 40;                                          // cameraOptions: quality
    this.targetWidth = 350;                                     // cameraOptions: targetWidth
    //this.targetHeight = 500;                                    // cameraOptions: targetHeight
    this.allowEdit = true;                                      // cameraOptions: allowEdit
    this.correctOrientation = true;                             // cameraOptions: correctOrientation
    
    // Saving options:
    this.encodingType = (typeof Camera !== "undefined") ? Camera.EncodingType.JPEG : 0;               // cameraOptions: encodingType
    this.saveToPhotoAlbum = true;                                                                     // cameraOptions: saveToPhotoAlbum
    
    // iOS-specific (to specify popover location in iPad):
    this.popoverOptions = ((typeof Camera !== "undefined") && (typeof CameraPopoverOptions !== "undefined")) ? new CameraPopoverOptions(220, 600, 320, 480, Camera.PopoverArrowDirection.ARROW_DOWN) : null;    // cameraOptions: popoverOptions
}

// Called on bodyLoad 
function onLoad() {
    
    document.addEventListener("deviceready", onDeviceReady, false);
    
    settings = new Settings();
    // Read and save cameraOptions from the "settings_form" elemen
}

// Called when Cordova is fully loaded (and calling to Cordova functions has become safe)
function onDeviceReady() {
    
    // Overwrite the default behavior of the device back button
    document.addEventListener("backbutton", onBackPress, false);
    fillSettingsInfo("settings_info");
    
    // Bind application button elements with their functionality
    $("#open_camera_button").bind ("click", onCapture);
    
    
}

// Overwrites the default behavior of the device back button
function onBackPress(e) {
    
    // Skip application history and exit application if the home page (menu page) is active
    if($.mobile.activePage.is("#home_page")){
        
        e.preventDefault();
        removeTemporaryFiles();
        navigator.app.exitApp();
    }
    else {
        
        // Do not save new cameraOptions and restore the previous state of the "settings_form" visual elements
        if ($.mobile.activePage.is("#settings_page")) {
            restoreSettings();
        }
        
        navigator.app.backHistory();
    }
}

// Removes all temporary files created by application. Is to be used when temporary files are not intended to be operated with further
function removeTemporaryFiles() {
    
    if (isIOS()) {
        
        // Currently camera.cleanup() seems not to remove files on iPad, iOS 5 and 6 (though onSuccess() function is called, 
        // as well as in the case of other PhoneGap file-remove operations).
        // Temporary directory is removed on application exit (e.g. on device switch off).
        //
        // navigator.camera.cleanup(onSuccess, onError); 
    }
    
    function onSuccess() {  }
    function onError(message) {  }
}

// Calls camera.getPicture() with cameraOptions customised by user
function onCapture(e) {
    
    var callerId = getTargetId(e, "a");
    
    switch (callerId) {
        case "open_camera_button":
            settings.sourceType = Camera.PictureSourceType.CAMERA;
            break;
        default:
            return;
    }
    
    navigator.camera.getPicture(onCaptureSuccess, onCaptureError, { quality : settings.quality, 
                                                                    destinationType : settings.destinationType, 
                                                                    sourceType : settings.sourceType, 
                                                                    allowEdit : settings.allowEdit, 
                                                                    encodingType : settings.encodingType,
                                                                    targetWidth : settings.targetWidth,
                                                                    targetHeight : settings.targetHeight,
                                                                    mediaType: settings.mediaType,
                                                                    saveToPhotoAlbum : settings.saveToPhotoAlbum,
                                                                    correctOrientation: settings.correctOrientation,
                                                                    popoverOptions : settings.popoverOptions
                                                                  });
}

// Shows photo captured by camera.getPicture()
function onCaptureSuccess(imageData) {
    $imageurl = imageData
    var photo = getElement("pic");
    photo.style.display = "block";
    photo.src = imageData;
    //"data:image/jpeg;base64,"
    $.mobile.changePage("#result_page", "slideup");
}
function cameraCallback(imageData) { 
    var image = document.getElementById('myImage'); image.src = imageData; } 
// camera.getPicture() callback function that provides an error message  
function onCaptureError(message) { }

// Reads customized camera options from the settings_form and saves them to the settings object (cameraOptions storage)


// Applies camera options stored in the settings object to the settings_form and updates visible form elements accordingly.
// Is to be used when the user changes the settings_form elements state but does not intend to "save" this changes


// Retrieves the underlying HTML DOM element from the event fired on jQuery element 
function getTargetId(event, tagName) {
    var target = (event.target.tagName == tagName)
                    ? event.target
                    : $(event.target).closest(tagName)[0]
    return target.id;
}

// Retrieves the HTML DOM element by the element id or returns the element if the element itself was sent to the function. 
function getElement(element) {
    
    if(typeof(element) == "string") {
    
        element = document.getElementById(element);
    }
    
    return element;
} 

// Fills the table providing information on current used cameraOptions
function fillSettingsInfo(infoDivName) {
    
    var settingsBatch = getElement("settings_form");
    if (settingsBatch == null) {
        return;
    }
    
    var settingsInfo = getElement(infoDivName);
    if (typeof Camera === "undefined") {
        settingsInfo.innerHTML = "<h3 style='text-decoration: underline;'>The Cordova Camera API is inaccessible</h3>";
    }
    else {
        settingsInfo.innerHTML = "";
    }
}