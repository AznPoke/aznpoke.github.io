$(document).ready(function () {
	$('button').click(function () {
		$("body").removeClass();
		var className = $(this).attr('class');
		$('body').addClass(className);
	})
});


var ballMap = new Map();
Papa.parse("https://aznpoke.github.io/balls.csv"+"?_="+ (new Date).getTime(), {
	header: true,
	download: true,
	complete: function(results) {
		
		for (var i = 0; i < results.data.length; i++)
		{
			ballMap.set(results.data[i]['name'], results.data[i]['imageloc']);
		}
		parseEvents();
	}
});

var ribbonMap = new Map();
Papa.parse("https://aznpoke.github.io/ribbons.csv"+"?_="+ (new Date).getTime(), {
	header: true,
	download: true,
	complete: function(results) {
		
		for (var i = 0; i < results.data.length; i++)
		{
			ribbonMap.set(results.data[i]['name'], results.data[i]['imageloc']);
		}
		
	}
});

var iconMap = new Map();
Papa.parse("https://aznpoke.github.io/games.csv"+"?_="+ (new Date).getTime(), {
	header: true,
	download: true,
	complete: function(results) {
		
		for (var i = 0; i < results.data.length; i++)
		{
			iconMap.set(results.data[i]['name'], results.data[i]['imageloc']);
		}
		
	}
});



function parseEvents()
{
	// Check query strings
	const params = new Proxy(new URLSearchParams(window.location.search), {
	  get: (searchParams, prop) => searchParams.get(prop),
	});
	
	var needFilter = false;
	var type = params.type;
	if (type)
	{
		$("input[name='showType'][value="+type+"]").prop('checked', true); 	
		needFilter = true;
	}
	
	var filter = params.filter;
	if (filter)
	{
		$("#filter").prop('value', filter);
		needFilter = true;
	}
	
	var multiples = params.multiples;
	if (multiples)
	{
		$("#showMultiples").prop('checked', multiples.toLowerCase() === 'true');
		needFilter = true;
	}
	
	var event_sheet_url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSUQk-oPFKWg9hUBhVOQ-n5ZtQrCsZ6nlcfJrAYJrkImGyBrz2XjXvBQb7rslGCnCjqRfTbPbWv3wWR/pub?output=csv';

	
	Papa.parse(event_sheet_url+"?_="+ (new Date).getTime(), {
		worker: true,
		//header: true,
		download: true,
		complete: function(results) {
			console.log(results);
			
			//d3.select("tbody").html("")
			//d3.selectAll("p").classed('noresults', true).html("")
			//d3.event.preventDefault();
			for (var i = 3; i < results.data.length; i++) {
			  var row = results.data[i];
			  if (row.length <= 1 || row[4] == "" || row[31] == "TRUE")
				  continue;

			  var rowHtml = "<td>"+(i-2)+"</td>";
			  rowHtml += addTag(row);
			  rowHtml += addPokemon(row,i);
			  rowHtml += addShiny(row);
			  rowHtml += addBall(row, i==3);
			  rowHtml += addEvent(row);
			  rowHtml += addGender(row);
			  rowHtml += addLevel(row);
			  rowHtml += addOT(row);
			  rowHtml += addTID(row);
			  rowHtml += addAbility(row);
			  rowHtml += addNature(row);
			  rowHtml += addDate(row);
			  rowHtml += addNotes(row);
			  rowHtml += addProofType(row);
			  rowHtml += addRibbon(row);
			  rowHtml += addIcon(row);
			  rowHtml += addHistory(row);
			 
			  var tr = d3.select("tbody").insert("tr").html(rowHtml);
			  tr.attr("row", i);
			  if (row[29]=="TRUE")
				tr.classed("personal", true);
			  else if (row[30]=="TRUE") // Keep these mutually exclusive
				tr.classed("traded", true);
			  else
			  {
				  tr.classed("ft", true);
				  if (row[32]=="TRUE") // No need to mark as a multiple if it's traded or personal
					tr.classed("multiple", true);
			  }
			  
			}
			
			filterTable();
		}
	});

}

function addTag(row)
{
	return "<td>"+row[1]+"</td>";
}
function addEvent(row)
{
	return "<td class='event'><a href='"+row[3]+"' target='_blank'>"+row[2]+ "</a></td>"
}
function addPokemon(row, i)
{
	var shinyLink = row[6] == "" ? "normal" : "shiny";
	var pokemon = row[4].toLowerCase();
	if (row[5] != "")
		pokemon = row[5].toLowerCase();
	
	var address = "https://play.pokemonshowdown.com/sprites/ani"+shinyLink+"/"+pokemon+".gif";
	var onError = "loadGen7Animated(this)";
	if (row[5].startsWith("http"))
	{
		address = row[5];
		onError = "";
	}
	
	return "<td class='pokemon'><div><img class='pokemon' data-pokemon='"+pokemon+"' data-shiny='"+row[6]+"' src='"+address+"' onload='checkImageSize(this)' onerror='"+onError+"' height='45'/></div>"+row[4]+ "</td>";
}
function addShiny(row)
{
	return "<td>"+row[6]+ "</td>";
}
function addBall(row, first)
{
	var ball = row[7] == "" ? "" : ballMap.get(row[7]);
	if (ball == undefined)
		console.log(row[7]);
	// Reflow after first ball loads to make sure columns line up with header
	var loaded = first ? " onLoad='loaded()' " : "";
	return "<td><img class='ball' src='"+ball+"' alt='"+row[7]+"' title='"+row[7]+"'"+loaded+"/></td>";
}
function addLevel(row)
{
	return "<td>"+row[8]+ "</td>";
}
function addGender(row)
{
	return "<td>"+row[9]+ "</td>";
}
function addAbility(row)
{
	return "<td>"+row[10]+ "</td>";
}
function addNature(row)
{
	return "<td>"+row[11]+ "</td>";
}
function addOT(row)
{
	return "<td class='ot'>"+row[12]+ "</td>";
}
function addTID(row)
{
	return "<td>"+row[13]+ "</td>";
}
function addDate(row)
{
	return "<td>"+row[14]+ "</td>";
}
function addNotes(row)
{
	return "<td class='notes'>"+row[20]+ "</td>";
}
function addProofType(row)
{
	return "<td>"+row[15]+ "</td>";
}
function addRibbon(row, first)
{

	
	var ribbon = row[17] == "" ? "" : ribbonMap.get(row[17]);
	if (ribbon == undefined)
		console.log(row[17]);
	 //Reflow after first ball loads to make sure columns line up with header
	var loaded = first ? " onLoad='loaded()' " : "";
	return "<td><img class='ribbon' src='"+ribbon+"' alt='"+row[17]+"' title='"+row[17]+"'"+loaded+"' height='45'/></td>";
}
//function addRibbon(row)
//{
//	return "<td>"+row[16]+ "</td>";
//}
function addIcon(row, first)
{
	var wrongGen = row[27] != row[28] ? " class='wrongGen'" : "";
	var icon = row[21] == "" ? "" : iconMap.get(row[21]);
	if (icon == undefined)
		console.log(row[21]);
	 //Reflow after first ball loads to make sure columns line up with header
	var loaded = first ? " onLoad='loaded()' " : "";
	return "<td"+wrongGen+"><img class='icon' src='"+icon+"' alt='"+row[21]+"' title='"+row[21]+"'"+loaded+"' height='50'/></td>";
	
}
function addHistory(row)
{
	const links = row[18] == "" ? [] : row[18].split(";");
	const trades = (row[19].match(/>/g) || []);
	const hist = row[19];
	var linkedhist = "";
	var lastIndex = 0;
	if (hist == "")
		linkedhist = hist;
	else
	{
		for (var i = 0; i < links.length && i < trades.length; i++)
		{
			const index = row[19].indexOf(">", lastIndex);
			if (index == -1)
				break;
			var href = "<a href='" + links[i] + "' target='_blank'>&gt</a>";
			if (links[i] == "")
				href = "&gt";
			linkedhist += hist.substring(lastIndex, index) + href;
			lastIndex = index+1;
		}
		linkedhist += hist.substring(lastIndex);
	}
	return "<td class='history'>"+linkedhist+ "</td>";
}

function addRule3(row)
{
	return "<td>"+row[26]+ "</td>";
}

function checkImageSize(img)
{
	if(img.naturalHeight == 66 && img.naturalWidth == 78)
	{
		loadGen7Animated(img);
	}
}

function loadGen7Animated(img)
{
	var pokemon = img.dataset.pokemon;
	var isShiny = img.dataset.shiny;
	var shinyLink = isShiny == "" ? "" : "-shiny";
	img.onerror = function() {loadMsikma(img)};
	img.src = "https://play.pokemonshowdown.com/sprites/ani"+shinyLink+"/"+ pokemon + ".gif";
}

function loadMsikma(img)
{
	img.onerror = function() {loadPokemonDB(img)};
	var pokemon = img.dataset.pokemon;
	var isShiny = img.dataset.shiny;
	var shinyLink = isShiny == "" ? "regular" : "shiny";
	
	img.classList.add("msikma");
	img.parentElement.classList.add("msikma");
	img.src = "https://raw.githubusercontent.com/msikma/pokesprite/master/pokemon-gen8/"+shinyLink+"/"+pokemon+".png"
}

function loadPokemonDB(img)
{
	img.onerror = null;
	var pokemon = img.dataset.pokemon;
	var isShiny = img.dataset.shiny;
	var shinyLink = isShiny == "" ? "regular" : "shiny";
	
	img.classList.add("pokemondb");
	img.parentElement.classList.add("pokemondb");
	img.src = "https://img.pokemondb.net/sprites/scarlet-violet/icon/"+pokemon+".png"
}


function loaded()
{	
	filterTable();
}

function filterKeyUp()
{
  var multiples = document.getElementById("showMultiples");
  var showMultiples = multiples.checked;
  
  if (!showMultiples)
	filterTable();
}

function filterTable() {
  // Declare variables
  var traded, ft, personal, allPokemon, multiples, showTraded, showFT, showPersonal, showAll, showMultiples, filter, filterText;
  traded = document.getElementById("showTraded");
  showTraded = traded.checked;
  ft = document.getElementById("showFT");
  showFT = ft.checked;
  personal = document.getElementById("showPersonal");
  showPersonal = personal.checked;
  allPokemon = document.getElementById("showAll");
  showAll = allPokemon.checked;
  multiples = document.getElementById("showMultiples");
  showMultiples = multiples.checked;
  filter = document.getElementById("filter");
  filterText = filter.value;
  
  var showSelector = "#eventTable tbody tr"
  $(showSelector).hide();
  
  
  if (showAll)
  {
	  if (!showMultiples)
	  {
		  showSelector += ":not(.multiple)";
	  }
  }
  else
  {
	  showSelector += ":not("
	  if (showTraded)
	  {
		  showSelector += ".personal,.ft";
	  }
	  else if (showPersonal)
	  {
		  showSelector += ".traded,.ft";
	  }
	  else if (showFT)
	  {
		  showSelector += ".traded,.personal";
	  }
	  if (!showMultiples)
	  {
		  showSelector += ",.multiple";
	  }
	  showSelector += ")";
  }
  
  showSelector += " td"
  $(showSelector).filter(function () {
        var $t = $(this);
		if ($t.text().toLowerCase().indexOf(filterText.toLowerCase()) > -1) {
			return true;
		}
        return false;
    }).parent().show();
  
  $("table tbody tr").removeClass("odd even");
  $("table tbody tr:visible:odd").addClass("odd");
  $("table tbody tr:visible:even").addClass("even");
}


