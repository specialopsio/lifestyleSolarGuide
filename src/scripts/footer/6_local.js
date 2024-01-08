let map
let geocoder
    function initLocal() {

    function waitForZip() {
        const data = endData
        if (data && data.zip) {
            initMap(endData.zip)
            fetchLocalData(endData.zip)
        } else {
            setTimeout(waitForZip, 100)
        }
        }
        
        waitForZip()
    }
    
    async function fetchLocalData(zipCode) {
        const url = `https://rk2ou3xhpk.execute-api.us-east-1.amazonaws.com/default/fetchPostal?zipCode=${zipCode}`;
    
        try {
            const response = await fetch(url);
            const resp_json = await response.json();
        if(resp_json.carbon_offset_metric_tons){
            set_local_data(resp_json)
        } else {
            document.getElementById('localStats').style.display = 'none'
        }
        if(resp_json.incentives){
            setIncentives()
        } else {
            document.getElementById('localIncentives').style.display = 'none'
        }
            return resp_json;
        } catch (error) {
            document.querySelector('.local-focus').style.display = 'none'
            console.error("Error in fetch:", error);
        }
    }
    
    function formatMK(num){
        if(num >= 1000000){
            return {'num': (num/1000000).toFixed(2), 'suff': 'm'}
        } else if(num >= 1000){
            return {'num': (num / 1000).toFixed(2), 'suff': 'k'}
        } else {
            return {'num': num.toFixed(2), 'suff': ''}
        }
    }
    
    function setIncentives(incentives){
      return true
    }
    
    function set_local_data(local_data){
      const co2_tonnage = formatMK(local_data.carbon_offset_metric_tons)
      const tree_abatement = formatMK(local_data.carbon_offset_metric_tons/0.039)
      const car_abatement = formatMK(local_data.carbon_offset_metric_tons/4.73)
      document.getElementById('c02').childNodes[0].textContent = co2_tonnage.num
      document.getElementById('cars').childNodes[0].textContent = car_abatement.num
      document.getElementById('trees').childNodes[0].textContent = tree_abatement.num
      document.getElementById('c02').childNodes[1].textContent = co2_tonnage.suff
      document.getElementById('cars').childNodes[1].textContent = car_abatement.suff
      document.getElementById('trees').childNodes[1].textContent = tree_abatement.suff
    
    }

function initMap(zipCode = '15243'){
    zipCode = document.getElementById('zip').textContent
    geocoder = new google.maps.Geocoder()
    let approximate_postcode = ''
    const mapOptions = {
        zoom: 6,
        mapTypeId: 'satellite',
        mapTypeControl: false,
        fullscreenControl: false,
        rotateControl: false,
        streetViewControl: false,
        zoomControl: false,
        center: { lat: -34.397, lng: 150.644 }, // Default center, will change after geocoding
    }
    geocoder.geocode({ 'address': zipCode }, function(results, status) {
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location)
            approximate_postcode = results[0].postcode_localities[0]
            if(approximate_postcode){
                const zips = [document.getElementById('zip'), document.getElementById('zip2')]
                zips.forEach((zip) => {
                    zip.textContent = approximate_postcode
                })
            }
        } else {
        console.debug('Geocode was not successful for the following reason: ' + status);
        }
    });
    const map_container = document.getElementById('localMap')
    const default_map = map_container.childNodes[0]
    const map_div = document.createElement('div')
    map_div.style.width = '100%'
    map_div.style.height = 'auto'
    map_div.style.aspectRatio = '16/9'
    map_div.style.borderRadius = '1rem'
    map_div.style.border = 'none'
    default_map.style.display = 'none'
    map = new google.maps.Map(map_div, mapOptions)
    map_container.appendChild(map_div)

    return true
}

function setNames(){

}

function smoothZoom(map, targetZoom, duration) {
    let startZoom = map.getZoom()
    let step = (targetZoom - startZoom) / (duration / 50)
    let currentZoom = startZoom;
    let zoomInterval = setInterval(() => {
        if ((step > 0 && currentZoom >= targetZoom) || (step < 0 && currentZoom <= targetZoom)) {
            clearInterval(zoomInterval)
        } else {
            currentZoom += step
            map.setZoom(currentZoom)
        }
    }, 50)
}
function zoomToZipCode() {
    smoothZoom(map, 15, 5000);
}
function onIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            zoomToZipCode('15243')
            observer_two.unobserve(entry.target)
        }
    })
}

let observer_two = new IntersectionObserver(onIntersection, {
    threshold: 0.5
})

document.addEventListener("DOMContentLoaded", () => {
    initLocal()
    const factsElement = document.getElementById(
        'local');
    if (factsElement) {
        console.log(
            "#maps element found. Starting to observe."
        )
        observer_two.observe(factsElement);
    } else {
        console.error(
            'Element with ID #localMap not found.');
    }
})