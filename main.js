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

const makeSVG = () => {
	if(document.getElementsByTagName('svg').length > 0){
		document.getElementsByTagName('svg')[0].remove();
	}
	let graph = d3.select(".graph")
		.append("svg")
		.attr("width", "500")
		.attr("height", "500")
		.append("g")
		.attr("transform", "translate(250,250)")
		.attr("class", "circle");

	return graph;
}

const drawCircle = (start, end, attrname1, attr1, attrname2, attr2, graph, fill) => {
	let arc = d3.arc()
		.innerRadius(70)
		.outerRadius(150)
		.startAngle(start)
		.endAngle(end);

	graph.append("path")
		.attr("class", "arc")
		.attr("stroke", "black")
		.attr("fill", fill)
		.attr('d', arc)
		.attr(attrname1, attr1)
		.attr(attrname2, attr2);
}

const drawTop10Burst = (top10, gSort) =>{
	let graph = makeSVG();
	let totalRates = 0;
	let angles = [];
	for(item in top10){
		totalRates += parseFloat(top10[item][13]);
	}
	start = 0;
	//dynamically change rgb values based on place in the top 10?  Would it make for a more uniform approach?
	addRgb = 0;
	for(item in top10){

		let fill = 'rgb(0, ' + addRgb + ', 204)';
		let country = top10[item][3];
		angles.push({});
		let end = start + ((2 * Math.PI) * (top10[item][13] / totalRates));

		drawCircle(start, end, 'country', country, 'value', parseFloat(top10[item][13]), graph, fill);
		addRgb += 20;
		angles[item] = {'start': start, 'end': end};
		start += (2 * Math.PI) * (top10[item][13] / totalRates);
	}

	let portions = document.getElementsByTagName("path");
	console.log(portions);
	for(let i = 0; i < portions.length; i++){
		portions[i].onmouseenter = () => {
			document.getElementById("title").innerText = portions[i].getAttribute("country");
			document.getElementById("value").innerText = 'Average opioid overdose death rate: ' + portions[i].getAttribute('value');
			rgb = portions[i].getAttribute("fill");
			portions[i].setAttribute("fill", "red");
		}
		portions[i].onmouseleave = () => {
			portions[i].setAttribute('fill', rgb);
		}
		portions[i].onclick = () => {
			console.log(gSort);
			console.log(top10);
			//(main, country, sub, region, gSort, top10, isTop10)
			drawGenderBurst2(null, portions[i].getAttribute("country"), null, null, gSort, top10, true)
		}
	}
}

//Remember: 12 for year, 13 for rate, 3 for country, 2 for deaths, 5 for gender, 16 for region, 17 for subregion

//compare average rates across regions and different rates within countries based on it, take it down to gender level
const drawRegionBurst = (main, gSort) => {
	let regionRates = {'Sum': 0.0, 'Asia': {'rates': 0, 'number': 0, 'average': 0}, 'Oceania': {'rates': 0, 'number': 0, 'average': 0}, 'Africa': {'rates': 0, 'number': 0, 'average': 0}, 'Europe': {'rates': 0, 'number': 0, 'average': 0}, 'Americas': {'rates': 0, 'number': 0, 'average': 0}}
	
	let graph = makeSVG();
	
	document.getElementById("current").innerText = "Currently viewing: Worldwide";

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
	let start = 0.0;
	let addRgb = 0;
	for(region in regionRates){
		if(region != 'Sum'){
			let fill = 'rgb(0, ' + addRgb + ', 204)';
			let nextStep = 2 * (regionRates[region]['average']/regionRates['Sum']) * Math.PI;
			let end = start + nextStep;
			drawCircle(start, end, 'region', region, 'value', regionRates[region]['average'], graph, fill);
			start = end;
			addRgb += 40;
		}
	}
	let portions = document.getElementsByTagName("path");
	for(let i = 0; i < portions.length; i++){
		if(i <= 4){
			let rgb;
			portions[i].onmouseenter = () => {
				document.getElementById("title").innerText = portions[i].getAttribute("region");
				document.getElementById("value").innerText = 'Average opioid overdose death rate: ' + portions[i].getAttribute('value');
				rgb = portions[i].getAttribute("fill");
				portions[i].setAttribute("fill", "red");
			}
			portions[i].onmouseleave = () => {
				portions[i].setAttribute('fill', rgb);
			}
			portions[i].onclick = () =>{
				drawSubRegionBurst(main, portions[i].getAttribute("region"), gSort);
			}
		}
	}

}
//make the draw subregion thing a click event.  Hell, make all of these click events.
//make each individual hierarchy clickable.

//Remember: 12 for year, 13 for rate, 3 for country, 2 for deaths, 5 for gender, 16 for region, 17 for subregion
const drawSubRegionBurst = (main, region, gSort) => {
	let graph = makeSVG();

	document.getElementById("current").innerText = "Currently viewing: " + region;

	let subRegions = {};
	let total = 0.0;
	for(entry in main){
		if(main[entry][16] == region){
			if(!subRegions[main[entry][17]]){
				subRegions[main[entry][17]] = {'sum': 0.0, 'num': 0, 'avg': 0.0};
			}
			subRegions[main[entry][17]]['sum'] += parseFloat(main[entry][13]);
			total += parseFloat(main[entry][13]);
			subRegions[main[entry][17]]['num'] += 1;
		}
	}

	console.log(subRegions);
	//loop through main regions, use that to build a new object that counts rates for subregions?
	
	let totAvg = 0.0;
	for(sub in subRegions){
		subRegions[sub]['avg'] = subRegions[sub]['sum'] / subRegions[sub]['num'];
		totAvg += subRegions[sub]['avg'];
	}

	let start = 0.0;
	let addRgb = 0;
	for(sub in subRegions){
		let fill = 'rgb(0, ' + addRgb + ', 204)';
		let nextStep = 2 * (subRegions[sub]['avg']/totAvg) * Math.PI;
		let end = start + nextStep;
		drawCircle(start, end, 'subregion', sub, 'value', subRegions[sub]['avg'], graph, fill);
		start = end;
		addRgb += 40
	}

	let portions = document.getElementsByTagName("path");
	let rgb;
	for(let i = 0; i < portions.length; i++){
		portions[i].onmouseenter = () => {
			document.getElementById("title").innerText = portions[i].getAttribute("subregion");
			document.getElementById("value").innerText = 'Average opioid overdose death rate: ' + portions[i].getAttribute('value');
			rgb = portions[i].getAttribute("fill");
			portions[i].setAttribute("fill", "red");

		}
		portions[i].onmouseleave = () => {
			portions[i].setAttribute('fill', rgb);
		}
		
		portions[i].onclick = () => {
			drawCountryBurst(main, portions[i].getAttribute("subregion"), region, gSort);
		}
	}
	let button = document.getElementById("goBack");
	button.onclick = () => {
		drawRegionBurst(main, region, gSort);
	}
}

const drawCountryBurst = (main, sub, region, gSort) => {

	document.getElementById("current").innerText = "Currently viewing: " + sub;
	let graph = makeSVG();
	let countries = {};
	let num = 0;
	let totAvg = 0.0;
	for(entry in main){
		if(main[entry][17] == sub){
			console.log(main[entry][3]);
			if(!countries[main[entry][3]]){
				countries[main[entry][3]] = {'avg': 0.0};
			}
			countries[main[entry][3]]['avg'] += parseFloat(main[entry][13]);
			totAvg += parseFloat(main[entry][13]);
		}
	}
	//////////////////////////////////////////////////////////////////////////////////////////////////////////
	let start = 0;
	let addRgb = 0;
	for(country in countries){
		let fill = 'rgb(0, ' + addRgb + ', 204)';
		let nextStep = 2 * (countries[country]['avg']/totAvg) * Math.PI;
		let end = start + nextStep;
		addRgb += 20;
		drawCircle(start, end, 'country', country, 'value', countries[country]['avg'], graph, fill);

		start = end;
	}

	let portions = document.getElementsByTagName("path");
	console.log(portions);
	for(let i = 0; i < portions.length; i++){
		portions[i].onmouseenter = () => {
			document.getElementById("title").innerText = portions[i].getAttribute("country");
			document.getElementById("value").innerText = 'Average opioid overdose death rate: ' + portions[i].getAttribute('value');
			rgb = portions[i].getAttribute("fill");
			portions[i].setAttribute("fill", "red");
		}
		portions[i].onmouseleave = () => {
			portions[i].setAttribute('fill', rgb);
		}
		portions[i].onclick = () => {
			console.log(portions[i].getAttribute("country"));
			drawGenderBurst2(main, portions[i].getAttribute("country"), sub, region, gSort, null, false);
		}
	}
	let button = document.getElementById("goBack");
	button.onclick = () => {
		drawSubRegionBurst(main, region, gSort);
	}

}

const drawGenderBurst2 = (main, country, sub, region, gSort, top10, isTop10) => {

	document.getElementById("current").innerText = "Currently viewing: " + country;

	let graph = makeSVG();	

	let genders = {'Male': 0.0, 'mRate': 0.0, 'Female': 0.0, 'fRate': 0.0};
	let avg = 0.0;
	for(entry in gSort){
		if(gSort[entry][3] == country && gSort[entry][5] == 'Male'){
			genders['Male'] = parseFloat(gSort[entry][13]);
		}else if(gSort[entry][3] == country && gSort[entry][5] == 'Female'){
			genders['Female'] = parseFloat(gSort[entry][13]);
		}
	}
	total = (genders['Male'] + genders['Female']);
	let start = 0;
	for(gender in genders){
		if(gender == "Male"){
			fill = "lightblue";
		}else if(gender == "Female"){
			fill = "pink";
		}
		let nextStep = 2 * (genders[gender]/total) * Math.PI;

		let end = start + nextStep;

		drawCircle(start, end, 'gender', gender, 'id', gender, graph, fill);
		start = end;
	}

	let portions = document.getElementsByTagName("path");
	console.log(portions);
	for(let i = 0; i < portions.length; i++){
		portions[i].onmouseenter = () => {
			document.getElementById("title").innerText = portions[i].getAttribute("gender");
			document.getElementById("value").innerText = 'Average opioid overdose death rate: ' + genders[portions[i].getAttribute("gender")];
			rgb = portions[i].getAttribute("fill");
			portions[i].setAttribute("fill", "red");
		}
		portions[i].onmouseleave = () => {
			portions[i].setAttribute('fill', rgb);
		}
		portions[i].onclick = () => {
			console.log(portions[i].getAttribute("country"));
			drawGenderBurst2(main, portions[i].getAttribute("country"), sub, region, gSort);
		}
	}

	let button = document.getElementById("goBack");
	if(isTop10 == false){
		button.onclick = () => {
			drawCountryBurst(main, sub, region, gSort);
		}
	}else{
		button.onclick = () => {
			console.log(top10);
			console.log(gSort);
			drawTop10Burst(top10, gSort);
		}
	}
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
	//start looking at average rates for this one - simple fractions and addition won't be informative enough
	let e = document.getElementById("top10");
	let choice = e.options[e.selectedIndex].value;
	let mainDrawing = bubblesort(mainSort);
	console.log(mainDrawing);
	if(choice == "worldwide"){
		console.log(mainDrawing);
		drawRegionBurst(mainDrawing, gSort);
	}else{
		let top10 = [mainDrawing[mainDrawing.length-1], mainDrawing[mainDrawing.length-2], mainDrawing[mainDrawing.length-3], mainDrawing[mainDrawing.length-4], mainDrawing[mainDrawing.length-5], mainDrawing[mainDrawing.length-6], mainDrawing[mainDrawing.length-7], mainDrawing[mainDrawing.length-8], mainDrawing[mainDrawing.length-9], mainDrawing[mainDrawing.length-10]]; 
		drawTop10Burst(top10, gSort);
	}
}


//accepts arrays of unsorted male/female and bubble-sorted totals
//This function will roll through the bSort, adding male and female data
//points to a new array of objects to be paired with each country.

//Remember: 12 for year, 13 for rate, 3 for country, 2 for deaths, 5 for gender

const bubblesort = (toBeSorted) => {
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
	return toBeSorted;
}

