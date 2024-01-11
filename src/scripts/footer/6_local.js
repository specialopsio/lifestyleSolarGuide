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
        let stateCode;
        const response = await fetch(url);
        const resp_json = await response.json();
        const incentives = resp_json.incentives.data
        if(resp_json.carbon_offset_metric_tons){
          stateCode = set_local_data(resp_json)
        } else {
          document.getElementById('localStats').style.display = 'none'
        }
        if(incentives){
            setIncentives(incentives)
        } else {
          // document.getElementById('localIncentives').style.display = 'none'
        }
        document.querySelector('.local-focus').style.display = 'block'
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
        
        async function setIncentives(incentives) {
            let table2List = document.querySelector('.table2_list')
            let templateItem = table2List.childNodes[0]
            let templateItemCom = table2List.childNodes[2]
            
            while (table2List.firstChild) {
              table2List.removeChild(table2List.firstChild)
            }
            
            incentives.sort((a, b) => {
              const sectorA = a.parameterSets[0] ? a.parameterSets[0].sectors[0].name : "--"
              const sectorB = b.parameterSets[0] ? b.parameterSets[0].sectors[0].name : "--"
              
              if (sectorA === sectorB) return 0;
              if (sectorA === "Residential") return -1
              if (sectorB === "Residential") return 1
              if (sectorA === "Commercial") return -1
              if (sectorB === "Commercial") return 1
              return 0
            });
            
            const residentialIncentives = incentives.filter(incentive => {
              return incentive.parameterSets[0] && incentive.parameterSets[0].sectors[0].name === "Residential" && incentive.websiteUrl;
            });
            
            const commercialIncentives = incentives.filter(incentive => {
              return incentive.parameterSets[0] && incentive.parameterSets[0].sectors[0].name === "Commercial" && incentive.websiteUrl;
            }).slice(0, 4)
            
            const unknownIncentives = incentives.filter(incentive => {
              return !incentive.parameterSets[0] || incentive.parameterSets[0].sectors[0].name === "--" && incentive.websiteUrl;
            }).slice(0, 3)
            
            document.querySelector('.incentivetotal').textContent = residentialIncentives.length + commercialIncentives.length + unknownIncentives.length - 1
            const sortedIncentives = [...residentialIncentives, ...commercialIncentives, ...unknownIncentives];
        
            sortedIncentives.forEach(incentive => {
              const inc_name = incentive.name
              const inc_type = incentive.typeObj.name
              const inc_sector = incentive.parameterSets[0] ? incentive.parameterSets[0].sectors[0].name : "--"
              const read_more_link = incentive.websiteUrl
        
              if (!read_more_link) {
                return
              }
        
              let temp_item = inc_sector === "Residential" ? templateItem.cloneNode(true) : templateItemCom.cloneNode(true)
              temp_item.childNodes[0].childNodes[0].textContent = inc_name
              inc_sector === "--" ? temp_item.querySelectorAll('.table2_column')[1].textContent = inc_sector : temp_item.childNodes[1].childNodes[0].textContent = inc_sector
              temp_item.childNodes[2].childNodes[0].textContent = inc_type
              temp_item.childNodes[3].childNodes[0].href = read_more_link
        
              table2List.appendChild(temp_item)
            })
        
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

function initMap(zipCode = '15203'){
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
            approximate_postcode = results[0].postcode_localities[0] ? results[0].postcode_localities[0] : results[0].address_components[0].long_name
            if(approximate_postcode){
                const zips = [document.getElementById('zip'), document.getElementById('zip2'), document.getElementById('zip3')]
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
            zoomToZipCode('15203')
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