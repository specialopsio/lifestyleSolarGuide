let map
let geocoder
function initLocal() {
    function waitForZip() {
        const data = endData
        if (data && data.zip) {
            initMap(endData.zip)
        } else {
            setTimeout(waitForZip, 100)
        }
    }

    waitForZip()
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