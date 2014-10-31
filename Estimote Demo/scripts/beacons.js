// define a beacon callback function
function onBeaconsReceived(result) {
    if (result.beacons && result.beacons.length > 0) {
        var msg = "<b>I found " + result.beacons.length + " beacons! Find them and scan the ISBN codes of the books to which they are attached to learn more about them.</b><br/>";
        for (var i=0; i<result.beacons.length; i++) {
            var beacon = result.beacons[i];
            if(beacon.distance > 0){
                msg += "<br/>";
            
                if (beacon.color !== undefined) {
                    msg += "There is a <b>" + beacon.color + "</b> beacon ";
                }
                
            msg += "within " + beacon.distance + " meters of this location.<br/>";
            }
            else{
                msg += "...but it's too far to find. Try retracing your steps to find it.<br/>";
            }
           
        }
        
    }
    
    else {
        var msg = "I haven't found a beacon just yet. Let's keep looking!"
    }
    
    document.getElementById('beaconlog').innerHTML = msg;
}

// wiring the fired event of the plugin to the callback function
document.addEventListener('beaconsReceived', onBeaconsReceived, false);

(function (global) {
    var BeaconViewModel,
        app = global.app = global.app || {};

    BeaconViewModel = kendo.data.ObservableObject.extend({

        start: function () {
            if (!this.checkSimulator()) {
                window.estimote.startRanging("Beacons");
            }
        },

        stop: function () {
            if (!this.checkSimulator()) {
                window.estimote.stopRanging();
            }
        },
               
        scan: function () {
            
            cordova.plugins.barcodeScanner.scan(
                
            function (result) {
                setTimeout(function() { 
                    var url = 'http://www.lookupbyisbn.com/Search/Book/' + result.text + '/1';                
                    var bookinfo = "<a href='#' onclick=window.open('" + url + "','_blank')>Learn more about this book</a>";
                    document.getElementById('bookinfo').innerHTML = bookinfo;                    
                }, 0);
                
                
            },
        
            function (error) {
                alert("Scanning failed: " + error);
            }
          )

            
        },

        checkSimulator: function() {
            if (window.navigator.simulator === true) {
                alert('This plugin is not available in the simulator.');
                return true;
            } else if (window.estimote === undefined) {
                alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
                return true;
            } else {
                return false;
            }
        }
        
    });

    app.beaconService = {
        viewModel: new BeaconViewModel()
    };
})(window);