/**
 * fmultiselect script
 * Copyright @mmoczynski
 * 
 */

const fs = require("fs");
const path = require("path");
const os = require("os");

const fmultiselect = {

	selectionFile: path.resolve(os.homedir(), "./selected.txt"),

	stdoutHelp: function() {
		
		console.log("select [FILE]... [where] [cond] - Selects the specified files. \n");

		console.log("deselect [FILE]... [where] [cond]- If no files are specified, the selection file is cleared. ");
		console.log("Otherwise, if there are files specified, the file is removed from the selection.");
	
		console.log("stdout - Prints the paths of the selected files.");
	
		console.log("testcond [conds] -- Test conditional. Outputs \"true\" if true and \"false\" if false.");
	
		console.log("--Conditionals:--\n");
		console.log("[argument] [operator] [value] [--hex|--bin|--oct]");
		
		console.log("Conditional arguments:\n");
		console.log("contents|name|year-modified|year-created|month-created|date-created|date-modified|user");
	
		console.log("Conditional operators:\n");
		
		console.log("starts-with|ends-with|=|contained|contained-in");

	},

	selectFile: function(file) {

		if(fs.existsSync(file)) {

			fs.realpath(file,"utf-8",function(err,resolvedPath){

				if(err) {
					console.error("Error: " + o);
				}

				else {
					fs.appendFileSync(fmultiselect.selectionFile,resolvedPath + "\n");
					console.log("Selected file" + resolvedPath);
				}

			});

		}

		else {
			console.error(file + " does not exist");
		}

	},

}

if(process.argv[2] === "select") {

	let fileArguments = [];
	let condArguments = [];
	let isSelectionConditional = false;

	for(var i = 3; i < process.argv.length; i++) {

		if(isSelectionConditional) {
			condArguments.push(process.argv[i])
		}
		
		if(!isSelectionConditional && process.argv[i] === "where") {
			isSelectionConditional = true;
		}

		if(!isSelectionConditional && process.argv[i] !== "where") {
			fileArguments.push(process.argv[i]);
		}

	}

	console.log(isSelectionConditional, fileArguments, condArguments);

	fileArguments.forEach(function(s) {

		if(isSelectionConditional) {

			let testString = "";
			let selectionCond = true;

			// First argument

			if(condArguments[0] === "contents") {
				testString = fs.readFileSync(s).toString('utf-8');
			} 

			else if(condArguments[0] === "name") {
				testString = s;
			} 

			else if(condArguments[0] === "year-modified") {
				
			} 

			else if(condArguments[0] === "year-created") {
				
			} 

			else {
				console.error(`Error: Invalid first conditonal argument "${condArguments[0]}".`)
			}

			// Second argument

			if(condArguments[1] === "starts-with") {
				selectionCond = testString.startsWith(condArguments[2])
			} 

			else if(condArguments[1] === "ends-with") {
				selectionCond = testString.endsWith(condArguments[2])
			} 

			else if(condArguments[1] === "=") {
				selectionCond = (testString === condArguments[2]);
			}

			else if(condArguments[1] === "!") {
				selectionCond = !(testString === condArguments[2]);
			}
			
			else if(condArguments[1] === "contains") {
				selectionCond = testString.includes(condArguments[1])
			}
			
			else {
				console.error(`Error: Invalid comparison operator "${condArguments[1]}"`)
			}

			if(selectionCond) {
				fmultiselect.selectFile(s);
			}

		}

		else {
			fmultiselect.selectFile(s);
		}

	});



}