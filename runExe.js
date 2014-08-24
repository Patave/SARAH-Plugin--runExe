	var DEBUG = false;


exports.action = function (data, callback, config, SARAH) {
    config = config.modules.runExe;
	var directory = data.directory + '/../';
	var process = '';
	var actionCallback = '';
	
	log(data.command); //Affiche dans le log la fonction appelée
	
	switch(data.command) {
		case "update": {
			//Appelé pour mettre à jour la liste les applications connues
			var lines = loadList(directory + '/plugins/runExe/proglist.txt');
			writeList(directory + '/plugins/runExe/runExe.xml', lines);
			actionCallback="Liste des applications mise a jour";
			break;
		}
		case "open": {
			//Appelé pour lancer un programme
			var exec = require('child_process').exec;
			process = data.path;
			log(process);
			var child = exec(process,function (error, stdout, stderr) {
				if (error !== null) {
					console.log('exec error: ' + error);
				}});
			actionCallback="D'accord, j'ouvre l'application "+ data.appName;
			break;
		}
		case "close": {
			//Appelé pour fermer un programme
			var exec = require('child_process').exec;
			var exeName = data.path.split("\\");
		    process = "taskkill /f /im "+ exeName[exeName.length - 1] +"";
			log(process);
			var child = exec(process,function (error, stdout, stderr) {
				if (error !== null) {
					console.log('exec error: ' + error);
				}});
			actionCallback="D'accord, je ferme l'application "+ data.appName;
			break;
		}
	}
  
	callback({ 'tts': actionCallback });	
}
    

//Charge la liste des proglist connues
function loadList(path) {
    fs = require('fs')
    var text = fs.readFileSync(path, 'utf8')
    var lines = text.toString().split("\n");
    return lines
}

//Met à jour runExe.xml en y écrivant la liste des applications connues
function writeList(filepath, proglist) {
    if (!filepath) { return; }
    if (!proglist || proglist.length == 0) { return; }

    var fs = require('fs');
    var xml = fs.readFileSync(filepath, 'utf8');

    var replace = '<!--\{-->\n';
    replace += '      <one-of>\n';
	log(proglist);
    for (var i = 0; i < proglist.length; i++) {
    proglist[i] = proglist[i].replace(/\r/, "");
        split = proglist[i].split('|');

		replace += '        <item>' + split[0]
						+ '<tag>out.action.path=\'' + split[1]
						+ '\',out.action.appName=' + split[2] 
						+ '</tag></item>\n';
		
	}

    replace += '      </one-of>\n';
    replace += '    <!--\}-->';
	log(replace);
    var xml = xml.replace(/(<!--\{-->)([\s\S]*)(<!--\}-->)/, replace);
    fs.writeFileSync(filepath, xml, 'utf8');
}

function log(value) {
	if(DEBUG)
		console.log("DEBUG: runExe : " + value);
}