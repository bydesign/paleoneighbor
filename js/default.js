angular.module('taxonApp', ["angucomplete"])
	.controller('TaxonController', function($http, $scope) {
		console.log('controller initialized');
		var taxonCtrl = this;
		taxonCtrl.resultsReturned = false;
		taxonCtrl.loading = false;
		taxonCtrl.getTaxons = function() {
			taxonCtrl.loading = true;
			taxonCtrl.resultsReturned = false;
			console.log('taxon control');
			var url = 'https://paleobiodb.org/data1.1/occs/list.json?show=loc,time,coords,phylo,stratext,lithext,abund,geo&base_name=';
			url += taxonCtrl.searchText;
			taxonCtrl.eag = 9999999999999;
			taxonCtrl.lag = 0;
			$http.get(url).
				success(function(data, status, headers, config) {
					taxonCtrl.loading = false;
					taxonCtrl.resultsReturned = true;
					console.log(data);
					taxonCtrl.taxonList = data.records;
					taxonCtrl.count = data.records.length;
					var formations = [];
					var formationObjs = {};
					var mapOptions = {
						center: { lat: 0, lng: 0},
						zoom: 1,
						scrollwheel: false
					};
					var map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);
					angular.forEach(data.records, function(taxon) {
						var myLatlng = new google.maps.LatLng(taxon.lat, taxon.lng);
						var marker = new google.maps.Marker({
							position: myLatlng,
							map: map,
							title: taxon.mna
						});
						if (taxon.eag < taxonCtrl.eag) {
							taxonCtrl.eag = taxon.eag;
						}
						if (taxon.lag > taxonCtrl.lag) {
							taxonCtrl.lag = taxon.lag;
						}
						var sfm = taxon.sfm;
						if (sfm != undefined && sfm.length > 0) {
							if (formations.indexOf(sfm) == -1) {
								formations.push(sfm);
								formationObjs[sfm] = 1;
							} else {
								formationObjs[sfm]++;
							}
						}
					});
					taxonCtrl.formations = formationObjs;
					console.log(taxonCtrl.eag);
					console.log(taxonCtrl.lag);
					
					//google.maps.event.addDomListener(window, 'load', initialize);

				}).
				error(function(data, status, headers, config) {
					console.log(data);
				}
			);
		};
	}
);


/*$(document).ready(function() {
	$.getJSON('https://paleobiodb.org/data1.1/occs/list.json?base_name=Cetacea&interval=Miocene&show=loc,time', function(data) {
		console.log(data);
		var $holder = $('#holder');
		var items = [];

		$.each(data.records, function() {
			var name = this.mna;
			var genus = name.split(' ')[0];
			if (items.indexOf(genus) == -1) {
				$holder.append('<li>'+genus+'</li>');
				items.push(genus);
			} else {
				
			}
			
		});
	});
});*/