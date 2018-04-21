/**
 * @author Martín Luz
 * @since 02/11/2017
 * @version 1.0
 */

;(function() {
    // Extension Context
    'use strict';

    const WS_URL     = "http://api.openweathermap.org/data/2.5/weather?units=metric"; 
    const WS_API_KEY = "6becf02ce497d0d559e69cd1924c7584";

    var $wrapper     = null;
    var $btnCurrent  = null; 
    var $inputSearch = null;
    var $details     = null;
    var $template    = null;
    var autoComplete = null;
    /**
     * Bootstra extension
     */
    function bootstrap() {
        $wrapper     = document.querySelector('#wrapper');
        $btnCurrent  = document.querySelector('#btn-current-location');
        $inputSearch = document.querySelector('#input-search');
        $details     = document.querySelector('#details');
        $template    = document.querySelector('#detailTemplate'); 

        // Init Autocomplete
        autoComplete = new google.maps.places.Autocomplete(document.getElementById('input-search'));
        google.maps.event.addListener(autoComplete, 'place_changed', onAutoCompleteChange);	
        getLocation();
    }
    /**
     * Autocomplete function Callback
     */
    function onAutoCompleteChange() {
        var place = autoComplete.getPlace();
        if(!place.geometry) {
            $details.innerHTML = '<b> :( Sorry, we can not load your location </b>';
        } else {
            console.log(place);
            var lat = place.geometry.location.lat();
		    var lng = place.geometry.location.lng();
            doRequest(lat, lng);
        }
    }
    /**
     * Get User location
     */
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => { 
                doRequest(position.coords.latitude, position.coords.longitude);
            });
        } else {
            $details.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    /**
     * Call the Webservice 
     * @param {*} position 
     */
    function doRequest(lat, lng) { 
        var urlFormat = WS_URL+ '&lat='+ lat + '&lon=' + lng + '&appid=' + WS_API_KEY; 
            $details.innerHTML = "Loading ...";
        //Do ajax Request
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var obj = JSON.parse(this.responseText);
            
                if(obj.cod == 200) {
                    var w = obj.weather[0];
                    var $tmp = $template.innerHTML;
                        $tmp = $tmp.replace('%%place%%', obj.name);
                        $tmp = $tmp.replace('%%icon%%', w.icon);
                        $tmp = $tmp.replace('%%description%%', w.description);
                        $tmp = $tmp.replace('%%wind%%', obj.wind.speed);
                        $tmp = $tmp.replace('%%temp_min%%', Math.floor(obj.main.temp_min));
                        $tmp = $tmp.replace('%%temp_max%%', Math.floor(obj.main.temp_max));
                        $tmp = $tmp.replace('%%hum%%', obj.main.humidity);
                        $tmp = $tmp.replace('%%pressure%%', obj.main.pressure);
                    
                    setTimeout(() => {
                        $details.innerHTML = $tmp;
                    }, 800);
                } else {
                    $details.innerHTML = 'Opps! An error has occurred please please try again';
                }
            } else {
                $details.innerHTML = 'Loading ...';
            }
        };

        xhttp.open("GET", urlFormat, true);
        xhttp.send();
    }

    document.addEventListener('DOMContentLoaded', function() {
        bootstrap();
    });
}).call(this);
