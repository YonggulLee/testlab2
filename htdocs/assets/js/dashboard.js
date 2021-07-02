fetch('https://iot.farota.com/api/tenant/devices?deviceName=0000000000000834').then(function(response){
  response.text().then(function(text){
    document.querySelector('article').innerHTML = text;
  })
})

conso
