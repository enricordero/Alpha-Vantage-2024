"use strict";

const _URL = "http://localhost:3000"
const MAPS_URL = "https://maps.googleapis.com/maps/api/js"

function inviaRichiesta(method, url, parameters={}) {
	let config={
		"baseURL": _URL,
		"url": url, 
		"method": method,
		"headers": {
			"Accept": "application/json",
		},
		"timeout": 5000,
		"responseType": "json",
	};
	if(method.toUpperCase()=="GET"){
	   config.headers["Content-Type"]='application/x-www-form-urlencoded;charset=utf-8';
	   config["params"]=parameters;   // plain object or URLSearchParams object
	}
	else{
		config.headers["Content-Type"] = 'application/json; charset=utf-8';
		config["data"]=parameters;     // Accept FormData, File, Blob
	}	
	let promise = axios(config);             
	return promise; // return a promise
}


function error(err) {
	if(!err.response) 
		alert("Connection Refused or Server timeout");	
	else if (err.response.status == 200)
        alert("Error - Incorrect data format: " + err.response.data);
    else
        alert("Server Error: " + err.response.status + " - " + err.message);
}



function random(min, max){
	return Math.floor((max-min)*Math.random()) + min;
}

//Images base 64 -> URI file virtualizzato
function base64Convert(fileObject) 
{
    return new Promise(function(resolve, reject){
    let reader = new FileReader();
    reader.readAsDataURL(fileObject);
    reader.onload = function (event) {
        resolve(event.target.result); // event.target sarebbe reader
    };
    reader.onerror = function (error) {
        reject(error);
    };
    });
}


function setAlert(message)
{
	setTimeout(function(){alert(message);}, 100);
}

function setAlertAndReload(message)
{
	setTimeout(function(){alert(message);location.reload();}, 100);
}


//Google Maps:
function caricaGoogleMaps()
{
	return new Promise(function(resolve, reject){
		let script = document.createElement("script");
		script.type="application/javascript"
		script.src=`${MAPS_URL}?v=3&key=${MAP_KEY}`;
		document.body.appendChild(script);
		script.onerror=function(){
			console.log("Error on Google Maps' load");
			reject(err);
		};
		script.onload=function(){
			resolve();
		};
	})
	
}

// dal 2024 l'indicazione della callback Ã¨ diventata obbligatoria
function loadingDone(){
	console.log("Google Maps caricate correttamente")
}


// importazione di una libreria dinamica (consigliato dal 2024)
function loadGoogleMapsDinamically(){
	(g => {
		let h,a,k,
			p="The Google Maps JavaScript API",
			c="google",
			l="importLibrary",
			q="__ib__",
			m=document,
			b=window;
		b=b[c]||(b[c]={})
		let d=b.maps||(b.maps={}),
			r=new Set,
			e=new URLSearchParams,
			u=()=>h||(h=new Promise(async(f,n)=>{
				await (a=m.createElement("script"));
				e.set("libraries",[...r]+"");
				for(k in g)
					e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);
				e.set("callback",c+".maps."+q);
				a.src=`https://maps.${c}apis.com/maps/api/js?`+e;
				d[q]=f;
				a.onerror=()=>h=n(Error(p+" could not load."));
				a.nonce=m.querySelector("script[nonce]")?.nonce||"";
				m.head.append(a);
			}))
			d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))
	})
	({
		key: MAP_KEY,
		v: "weekly",    
	})
}
//end Google Maps


//I for each:
/*
Vettori javaScript metodo -> .forEach(item, i).

Vettore jQuery metodo -> .each(i,item).

In ogni caso "item" è sempre tipo javaScript (per uso jQuery $(item)).
*/

//Ordinare un JSON
/*
let myKey = "key";

myArray.sort(function(record1, record2) {
 let str1 = record1[myKey].toUpperCase();
 let str2 = record2[myKey].toUpperCase();
 if (str1 < str2)
 return -1;
 else if (str1 > str2)
 return 1;
 else return 0;
 }); 
*/