currentPage = 0;
pagging = false;
nextPage = true;
choosed = [];

function Search (page){
	var text = document.getElementById('SearchText').value;
	if (text === "") {
		alert("The search field was empty.");
		return;
	}
	document.getElementById("result").innerHTML = "";
	document.getElementById("galleryList").innerHTML = "";
	document.getElementById("result").style.display = "block";
	document.getElementById("gallery").style.display = "none";

	if (!pagging) {
		choosed = [];
	}

	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=7c9e9d76062d5326e08cdd84a2ef8a2d&format=json&page=' + page + '&per_page=250&text=' + text);
	xhr.onload = function() {
		if (xhr.status === 200) {

			var list = eval(xhr.responseText);
			document.getElementById('result').innerHTML = list;
		}
		else {
			alert('Something went wrong. Please try again. ' + xhr.status);
		}
	};
	xhr.send();
}
function SearchPage (n) {
	if (n === -1 && currentPage <= 1) {
		return;
	}
	nextPage = n > 0;
	pagging = true;
	Search(currentPage + n);
}
function SearchOnEnter(event){
	if (event.keyCode === 13) {
		Search(1);
	}
	// event.handled();
}
function jsonFlickrApi(rsp){
	if (rsp.stat !== "fail") {
		if (pagging) {
			currentPage = nextPage ? currentPage + 1 : (currentPage > 1 ? currentPage - 1 : 1);
			pagging = false;
		}else
		{
			currentPage = 1;
		}
		document.getElementById("currentPage").innerHTML = currentPage;

		var list = '<ul class="clear">';
		var arr = rsp.photos.photo;
		for (var i = 0; i < arr.length; i++) {
			var obj = arr[i];
			var link = 'https://farm' + obj.farm + '.staticflickr.com/' + obj.server + '/' + obj.id + '_' + obj.secret + '.jpg';
			list = list + '<li><img id="img_' + obj.id + '" onclick="AddImage(this.id);" src="' + link + '"/><img class="watermark" src="checked.png" /></li>';
		}
		list = list + "</ul>";
		return list;
	}
	else{
		alert("Something went wrong. " + rsp.message);
		return "";
	}
}

function AddImage(id){
	var e = document.getElementById(id);
	var index = ImageIndexOf(id);
	if (index === -1) {
		e.parentElement.className = "selected";
		choosed.push({'id' : id, 'src' : e.src });
	}
	else{
		e.parentElement.className = "";
		choosed.splice(index, 1);
	}
}

function Display(){
	if (choosed.length > 0) {
		var list = '<ul class="clear">';
		for (var i = 0; i < choosed.length; i++) {
			list = list + '<li class="clear">><img id="' + choosed[i].id + '" onclick="ShowImage(this.id);" src="' + choosed[i].src + '"/></li>';
		}
		list = list + '</ul>';

		document.getElementById("result").style.display = "none";
		document.getElementById("gallery").style.display = "block";
		document.getElementById("galleryBig").src = choosed[0].src;
		document.getElementById("galleryList").innerHTML = list;
	}
	else
	{
		alert("Nothing to display. Choose att least one image to display in gallery.");
	}
}

function ShowImage(id){
	var selected = document.getElementsByClassName("selected");
	if(selected.length > 0){
		selected[0].className = "";
	}
	var e = document.getElementById(id);
	e.parentElement.className = "selected";
	document.getElementById("galleryBig").src = e.src;
}

function ImageIndexOf(id){
	for(var i = 0; i < choosed.length; i++) {
		if(choosed[i].id === id) {
			return i;
		}
	}
	return -1;
}
