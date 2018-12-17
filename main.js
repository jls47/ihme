//WORKING ON FULLY LOADED WORLDWIDE VIEW- KEEP TOP 10, THEN GO FOR GENDER

//Upon loading the document, one must load the csv first.  CSS Spinner or something to be added later.
$(document).ready(function(){
	var processed = [];
	$.ajax({
		type: "GET",
		url: 'https://raw.githubusercontent.com/jls47/ihme/master/ihme.csv',
		dataType: 'text',
		success: function(data){
			//upon loading the csv, parse it into a big old array!
			processed = processData(data);
			console.log(processed);
			//This will become a click event.  It handles the drawing and everything, and eventually will accept as parameters
			//input from a couple forms.  There are two primary means of comparison, and each will likely wind up looking
			//different in the code: starting with gender or country needs different sublevels, but I will try my best
			//to make the sorting code more universal than not.
		}
	});
	console.log(processed);
	$('.button').click(function(){
		if(document.getElementsByTagName('svg').length > 0){
			document.getElementsByTagName('svg')[0].remove();
		}
		let option = $('select.options option:checked').val();
		let year = $('.year').val();
		let regions = {"Asia": {"Eastern Asia":["China","Hong Kong","Japan","Macao","Mongolia","North Korea","South Korea","Taiwan"],"South-Eastern Asia": ["Brunei Darussalam","Cambodia","Indonesia","Laos","Malaysia","Myanmar","Philippines","Singapore","Thailand","Timor-Leste","Vietnam"],"Southern Asia": ["Afghanistan","Bangladesh","Bhutan","India","Iran","Maldives","Nepal","Pakistan","Sri Lanka"],"Western Asia": ["Armenia","Azerbaijan","Bahrain","Georgia","Iraq","Israel","Jordan","Kuwait","Lebanon","Oman","Palestine","Qatar","Saudi Arabia","Syria","Turkey","United Arab Emirates","Yemen"],"Central Asia": ["Kazakhstan","Kyrgyzstan","Tajikistan","Turkmenistan","Uzbekistan"]},"Africa": {"Northern Africa": ["Algeria","Egypt","Libya","Morocco","Sudan","Western Sahara", "Tunisia"],"Southern Africa": ["Botswana","French Southern Territories","Lesotho","Namibia","South Africa","Swaziland"],"Western Africa": ["Benin","Burkina Faso","Cabo Verde","Gambia","Ghana","Guinea","Guinea-Bissau","Cote d'Ivoire","Liberia","Mali","Mauritania","Niger","Nigeria","Saint Helena, Ascension and Tristan da Cunha","Sao Tome and Principe", "Senegal","Sierra Leone","Togo"], "Middle Africa": ["Angola","Cameroon","Central African Republic","Chad","Congo","Democratic Republic of the Congo","Equatorial Guinea","Gabon","South Sudan"],"Eastern Africa": ["British Indian Ocean Territory","Burundi","Comoros","Djibouti","Eritrea","Ethiopia","Kenya","Madagascar","Malawi","Mauritius","Mayotte","Mozambique","Réunion","Rwanda","Seychelles","Somalia","Tanzania","Uganda","Zambia","Zimbabwe"]},"Americas": {"Caribbean": ["Anguilla","Antigua and Barbuda","Aruba","Bahamas","Barbados","Bonaire, Sint Eustatius and Saba","Virgin Islands (British)","Virgin Islands (U.S.)","Cayman Islands","Cuba","Curaçao","Dominica","Dominican Republic","Grenada","Guadeloupe","Haiti","Jamaica","Martinique","Montserrat","Puerto Rico","Saint Barthélemy","Saint Kitts and Nevis","Saint Lucia","Saint Martin (French part)","Saint Vincent and the Grenadines","Sint Maarten (Dutch part)","Trinidad and Tobago","Turks and Caicos Islands"],"South America": ["Argentina","Bolivia","Chile","Colombia","Ecuador","Falkland Islands","Guyana","Guyana","Paraguay","Peru","South Georgia and the South Sandwich Islands","Suriname","Uruguay","Venezuela"],"Central America": ["Belize","Costa Rica","El Salvador","Guatemala","Honduras","Nicaragua","Panama"],"North America": ["Bermuda","United States Minor Outlying Islands","Canada","Greenland","Saint Pierre and Miquelon","United States of America"]},"Europe": {"Northern Europe": ["Åland Islands","Denmark","Estonia","Faroe Islands","Finland","Guernsey","Iceland","Ireland","Isle of Man","Jersey","Latvia","Lithuania","Norway","Svalbard and Jan Mayen","Sweden","United Kingdom"],"Southern Europe": ["Albania","Andorra","Bosnia and Herzegovina","Croatia","Cyprus","Gibraltar","Greece","Holy See","Italy","Macedonia","Malta","Montenegro","Portugal","San Marino","Serbia","Slovenia","Spain"],"Eastern Europe": ["Belarus","Bulgaria","Czech Republic","Hungary","Moldova (Republic of)","Poland","Republic of Kosovo","Russian Federation","Slovakia","Ukraine"],"Western Europe": ["Austria","Belgium","France","Germany","Liechtenstein","Luxembourg","Monaco","Netherlands",]},"Oceania": {"Australia and New Zealand": ["Australia","Christmas Island","Cocos (Keeling) Islands","New Zealand","Norfolk Island"],"Polynesia": ["Samoa","American Samoa","Cook Islands","French Polynesia","Niue","Pitcairn","Tokelau","Tonga","Tuvalu","Wallis and Futuna"],"Micronesia": ["Guam","Kiribati","Marshall Islands","Federated States of Micronesia","Nauru","Northern Mariana Islands","Palau"],"Melanesia": ["Fiji","New Caledonia","Papua New Guinea","Solomon Islands","Vanuatu"]}}
		console.log(option + ' ' + year);
		if(option == "country"){
			drawCountryLevels(processed, year, regions, true);
		}else if(option == "gender"){
			drawGenderLevels(processed, year, regions);
		}else{
			drawCountryLevels(processed, year, regions, false);
		}
		
	});

});
//Sunburst with modifiers
//12 for year, 13 for rate, 3 for country, 2 for deaths, 5 for gender
//on page load, load and parse the csv.  On changing the parameters and pressing submit, use the function to redraw.  Animate?
//split by gender in a second level?  How to parse?  OH!  The drawing by gender is already there!  How to dynamically set conditions?
//DIFFERENT METHODS OF SORTING:
//Gender, country, or year top level?
//Start with country/year -> gender to get a handle on things
//gender/year -> top 5 countries each side?
//top 10 all around at any time?
//


//hold up.  Instead of just top 10, should I also include the rest of the world?  Stretch goal?
const processData = (data) => {
	var lines = data.split(/\r\n|\n/);
	lines.shift();
	lines.pop();
	var x = 0
	entries = [];
	lines.forEach(function (line){
		newline = line.split(',');
		entries.push(newline);
	})
	return entries;
}

const drawTop10Burst = (top10, graph) =>{
	let totalRates = 0;
	let angles = [];
	for(item in top10){
		totalRates += parseFloat(top10[item][13]);
	}
	console.log(totalRates);
	start = 0;
	//dynamically change rgb values based on place in the top 10?  Would it make for a more uniform approach?
	
	for(item in top10){
		let country = top10[item][3];
		angles.push({});
		let end = start + ((2 * Math.PI) * (top10[item][13] / totalRates));
		let arc = d3.arc()
			.innerRadius(70)
			.outerRadius(150)
			.startAngle(start)
			.endAngle(end);

		graph.append("path")
			.attr("class", "arc")
			.attr("stroke", "black")
			.attr("fill", "white")
			.attr("d", arc);

		angles[item] = {'start': start, 'end': end};
		start += (2 * Math.PI) * (top10[item][13] / totalRates);
	}
	return angles;
}


const drawGBurst = (top10g, angles, graph) =>{
	for(key in top10g){
		let mRate = top10g[key]["Male"];
		let fRate = top10g[key]["Female"];
		let total = mRate + fRate;
		let mStart = angles[key]['start'];
		let mEnd = mStart + ((mRate / total) * (angles[key]['end'] - angles[key]['start']));
		let fStart = mEnd;
		let fEnd = angles[key]['end'];
		console.log([mStart, mEnd, fStart, fEnd]);
		let arcM = d3.arc()
			.innerRadius(150)
			.outerRadius(190)
			.startAngle(mStart)
			.endAngle(mEnd);

		graph.append("path")
			.attr("class", "arc")
			.attr("stroke", "black")
			.attr("fill", "red")
			.attr("d", arcM);

		let arcF = d3.arc()
			.innerRadius(150)
			.outerRadius(190)
			.startAngle(fStart)
			.endAngle(fEnd);

		graph.append("path")
			.attr("class", "arc")
			.attr("stroke", "black")
			.attr("fill", "blue")
			.attr("d", arcF);
	}
}

//Remember: 12 for year, 13 for rate, 3 for country, 2 for deaths, 5 for gender, 16 for region, 17 for subregion

//compare average rates across regions and different rates within countries based on it, take it down to gender level
const drawRegionBurst = (main, graph) => {
	let regionRates = {'Sum': 0.0, 'Asia': {'rates': 0, 'number': 0, 'average': 0}, 'Oceania': {'rates': 0, 'number': 0, 'average': 0}, 'Africa': {'rates': 0, 'number': 0, 'average': 0}, 'Europe': {'rates': 0, 'number': 0, 'average': 0}, 'Americas': {'rates': 0, 'number': 0, 'average': 0}}
	for(entry in main){
		for(region in regionRates){
			if(region == main[entry][16]){
				regionRates[region]['rates'] += parseFloat(main[entry][13]);
				regionRates[region]['number'] += 1;
				
			}
		}
	}
	for(region in regionRates){
		if(region != 'Sum'){
			regionRates[region]['average'] = regionRates[region]['rates'] / regionRates[region]['number'];
			regionRates['Sum'] += regionRates[region]['average'];
		}
	}
	let angles = {'Asia': {}, 'Oceania': {}, 'Africa': {}, 'Americas': {}, 'Europe': {}};
	start = 0;
	for(region in regionRates){
		if(region != 'Sum'){
			let nextStep = 2 * (regionRates[region]['average']/regionRates['Sum']) * Math.PI;
			let end = start + nextStep;
			angles[region]['start'] = start;
			angles[region]['end'] = end;
			let arc = d3.arc()
				.innerRadius(70)
				.outerRadius(150)
				.startAngle(start)
				.endAngle(end);

			graph.append("path")
				.attr("class", "arc")
				.attr("stroke", "black")
				.attr("fill", "white")
				.attr('d', arc)
				.attr('region', region)
				.on('click', function(d, i){
					console.log(region);
					drawSubRegionBurst(main, graph, region);
				});

			start = end;
		}
	}
}
//make the draw subregion thing a click event.  Hell, make all of these click events.
//make each individual hierarchy clickable.

//Remember: 12 for year, 13 for rate, 3 for country, 2 for deaths, 5 for gender, 16 for region, 17 for subregion
const drawSubRegionBurst = (main, graph, region) => {
	console.log(region);
	if(document.getElementsByTagName('svg').length > 0){
		document.getElementsByTagName('svg')[0].remove();
	}

	let subRegions = {};
	for(entry in main){
		if(main[entry][16] == region){
			subRegions[main[entry][17]] = {'sum': 0.0, 'num': 0};
			subRegions[main[entry][17]]['sum'] += main[entry][13];
			subRegions[main[entry][17]]['num'] += 1;
		}
	}
	console.log(subRegions);
	//loop through main regions, use that to build a new object that counts rates for subregions?
	
	debugger;
}

const drawCountryBurst = () => {

}

const drawGenderLevels = (entries, year, regions) => {
	let mainSort = [];
}

//Starting with a main level of top 10 countries, with sublevels broken down based on gender
//Starts off by sorting by year.
const drawCountryLevels = (entries, year, regions, top10) => {
	let mainSort = [];
	let gSort = [];
	for(entry in entries){
		let item = entries[entry];
		if(parseInt(item[12]) == year && item[5] == "Both"){
			for(region in regions){
				if(JSON.stringify(regions[region]).indexOf(item[3]) != -1){
					item.push(region);
					for(sub in regions[region]){
						if(JSON.stringify(regions[region][sub]).indexOf(item[3]) != -1){
							item.push(sub);
						}
					}
				}
			}
			mainSort.push(item);
		}else if(parseInt(item[12]) == year){
			gSort.push(item);
		}
	}

	let graph = d3.select(".graph")
		.append("svg")
		.attr("width", "1000")
		.attr("height", "1000")
		.append("g")
		.attr("transform", "translate(500,500)");

	if(top10 == true){
		//make a box for "rest of the world"?
		let mainDrawing = bubblesort(mainSort, true);
		let gDrawing = genderSort(gSort, mainDrawing);
		let countryAngles = drawTop10Burst(mainDrawing, graph);
		drawGBurst(gDrawing, countryAngles, graph);
	}else{
		//start looking at average rates for this one - simple fractions and addition won't be informative enough
		let mainDrawing = bubblesort(mainSort, false);
		console.log(mainDrawing);
		let regionAngles = drawRegionBurst(mainDrawing, graph);
		//drawGBurst(gDrawing, countryAngles, graph);
	}
	
	
	//Time for a bunch of D3!  Do the sunburst but with the top 10 and whatnot.  
}


//accepts arrays of unsorted male/female and bubble-sorted totals
//This function will roll through the bSort, adding male and female data
//points to a new array of objects to be paired with each country.

//Remember: 12 for year, 13 for rate, 3 for country, 2 for deaths, 5 for gender

const genderSort = (gSort, bSort) => {
	let gArr = [];
	for(item in bSort){
		gArr.push({});
		let country = bSort[item][3];
		for(entry in gSort){
			if(gSort[entry][3] == country){
				gArr[item][gSort[entry][5]] = parseFloat(gSort[entry][13]);
			}
		}
	}
	return gArr;
}

const bubblesort = (toBeSorted, top10) => {
	sorting = true;
	while(sorting == true){
		let swaps = 0;
		for(let i = 0; i < toBeSorted.length -1; i++){
			if(parseFloat(toBeSorted[i][13]) > parseFloat(toBeSorted[i+1][13])){
				let h = toBeSorted[i+1];
				toBeSorted[i+1] = toBeSorted[i];
				toBeSorted[i] = h;
				swaps += 1;
			}
		}
		if(swaps == 0){
			sorting = false;
		}
	}
	if(top10 == true){
		return [toBeSorted[toBeSorted.length - 1], toBeSorted[toBeSorted.length - 2], toBeSorted[toBeSorted.length - 3], toBeSorted[toBeSorted.length - 4], toBeSorted[toBeSorted.length - 5], toBeSorted[toBeSorted.length - 6], toBeSorted[toBeSorted.length - 7], toBeSorted[toBeSorted.length - 8], toBeSorted[toBeSorted.length - 9], toBeSorted[toBeSorted.length - 10]];
	}else{
		return toBeSorted;
	}
}

