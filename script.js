/*
CS 6110 Program 3
Richard Scott McNew
richard.scott.mcnew@gmail.com
A02077329
    
 Copyright (C) 2019, Richard Scott McNew.  

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/ 
/* Turn-on strict mode for easier debugging */
'use strict';

let fieldNames = [
    "voter-a-alex-vote",
    "voter-b-alex-vote",
    "voter-c-alex-vote",
    "voter-d-alex-vote",
    "voter-a-bart-vote",
    "voter-b-bart-vote",
    "voter-c-bart-vote",
    "voter-d-bart-vote",
    "voter-a-cindy-vote",
    "voter-b-cindy-vote",
    "voter-c-cindy-vote",
    "voter-d-cindy-vote",
    "voter-a-david-vote",
    "voter-b-david-vote",
    "voter-c-david-vote",
    "voter-d-david-vote",
    "voter-a-erik-vote",
    "voter-b-erik-vote",
    "voter-c-erik-vote",
    "voter-d-erik-vote",
    "voter-a-frank-vote",
    "voter-b-frank-vote",
    "voter-c-frank-vote",
    "voter-d-frank-vote",
    "voter-a-greg-vote",
    "voter-b-greg-vote",
    "voter-c-greg-vote",
    "voter-d-greg-vote"];

let weightNames = [
    "voter-a-weight",
    "voter-b-weight",
    "voter-c-weight",
    "voter-d-weight"];

let voterNames = [
    "voter-a",
    "voter-b",
    "voter-c",
    "voter-d"];

let candidateNames = [
	"alex",
	"bart",
	"cindy",
	"david",
	"erik",
	"frank",
	"greg"];
    
let defaultFieldValues = {
    "voter-a-alex-vote": 3,
    "voter-b-alex-vote": 1,
    "voter-c-alex-vote": 2,
    "voter-d-alex-vote": 4,
    "voter-a-bart-vote": 1,
    "voter-b-bart-vote": 2,
    "voter-c-bart-vote": 5,
    "voter-d-bart-vote": 7,
    "voter-a-cindy-vote": 2,
    "voter-b-cindy-vote": 3,
    "voter-c-cindy-vote": 7,
    "voter-d-cindy-vote": 3,
    "voter-a-david-vote": 4,
    "voter-b-david-vote": 7,
    "voter-c-david-vote": 6,
    "voter-d-david-vote": 6,
    "voter-a-erik-vote": 6,
    "voter-b-erik-vote": 5,
    "voter-c-erik-vote": 3,
    "voter-d-erik-vote": 1,
    "voter-a-frank-vote": 5,
    "voter-b-frank-vote": 6,
    "voter-c-frank-vote": 1,
    "voter-d-frank-vote": 2,
    "voter-a-greg-vote": 7,
    "voter-b-greg-vote": 4,
    "voter-c-greg-vote": 4,
    "voter-d-greg-vote": 5};

let defaultWeightValues = {
    "voter-a-weight": 5,
    "voter-b-weight": 4,
    "voter-c-weight": 3,
    "voter-d-weight": 6};

function setVoterTableToDefault() {
    document.getElementById("voter-preference-selector").selectedIndex = 0;
    d3.selectAll(".invalid").classed("invalid", false);
    weightNames.forEach( weightName => {
        document.getElementById(weightName).value = defaultWeightValues[weightName];
    });
    fieldNames.forEach( fieldName => {
        document.getElementById(fieldName).value = defaultFieldValues[fieldName]; 
    });
}

function getRandomWeight() {
    return Math.floor(Math.random() * Math.floor(10));
}

function getVoterChoices() {
    return [1, 2, 3, 4, 5, 6, 7];
}

function randomChoice(voterChoices) {
    let index = Math.floor(Math.random() * Math.floor(voterChoices.length));
    return voterChoices.splice(index, 1);
}

function setVoterTableToRandom() {
    document.getElementById("voter-preference-selector").selectedIndex = 0;
    d3.selectAll(".invalid").classed("invalid", false);
    weightNames.forEach( weightName => {
        document.getElementById(weightName).value = getRandomWeight();
    });
    let voterAChoices = getVoterChoices();
    let voterBChoices = getVoterChoices();
    let voterCChoices = getVoterChoices();
    let voterDChoices = getVoterChoices();
    fieldNames.forEach( fieldName => {
        let choice = -1;
        if (fieldName.startsWith("voter-a")) {
            choice = randomChoice(voterAChoices);

        } else if (fieldName.startsWith("voter-b")) {
            choice = randomChoice(voterBChoices);

        } else if (fieldName.startsWith("voter-c")) {
            choice = randomChoice(voterCChoices);

        } else {  // "voter-d"
            choice = randomChoice(voterDChoices);
        }
        document.getElementById(fieldName).value = choice; 
    });
}

function rotateVoter(voterName) {
	// console.log("rotate " + voterName);
    document.getElementById("voter-preference-selector").selectedIndex = 0;
	let firstFieldName = null;
	let previousFieldValue = null; 
	fieldNames.forEach( fieldName => {
		if (fieldName.startsWith(voterName)) {
			if (firstFieldName === null) {
				firstFieldName = fieldName;
				previousFieldValue = document.getElementById(fieldName).value;
			} else {
				let currentFieldValue = document.getElementById(fieldName).value;
				document.getElementById(fieldName).value = previousFieldValue;
				previousFieldValue = currentFieldValue;
			}
		}
	});	
	document.getElementById(firstFieldName).value = previousFieldValue;
    validateVoter(voterName);
}

function setVoterTableToPreference(preferenceString) {
    if (preferenceString !== "") {
        // console.log("preferenceString is: " + preferenceString);
        let [betterCandidate, , worseCandidate] = preferenceString.split("-");
        // console.log("betterCandidate is: " + betterCandidate + ", worseCandidate is: " + worseCandidate);
        voterNames.forEach( voterName => {
            let betterKey = voterName + "-" + betterCandidate + "-vote"; 
            let worseKey = voterName + "-" + worseCandidate + "-vote"; 
            let betterValue = document.getElementById(betterKey).value;
            let worseValue = document.getElementById(worseKey).value;
            if (worseValue < betterValue) {  // swap if needed
                // console.log("Swapping " + betterKey + "=" + betterValue + " with " + worseKey + "=" + worseValue);
                document.getElementById(betterKey).value = worseValue;
                document.getElementById(worseKey).value = betterValue;
            }
        });
    }
    voterNames.forEach( voterName => { validateVoter(voterName) });
}

function validateVoter(voterName) {
    let choices = getVoterChoices(); 
    let result = true;
	fieldNames.forEach( fieldName => {
		if (fieldName.startsWith(voterName)) {
            let element = document.getElementById(fieldName);
            let index = choices.indexOf(element.valueAsNumber);
            if (index === -1) {
                element.classList.add("invalid");
                result = false;
            } else {
                element.classList.remove("invalid");
                choices.splice(index, 1);    
            }
		}
	});	
    return result;
}

function printVoterName(voterName) {
    return "Voter " + voterName.charAt(6).toUpperCase();
}

function extractCandidateFromField(field) {
	return field.split("-")[2];	
}

function calculateRanking() {
	let ranking = [];
	let candidateTotals = {};
	// initialize candidate totals
	candidateNames.forEach( candidateName => {
		candidateTotals[candidateName] = 0;		
	});	
	// calculate totals from table
	fieldNames.forEach( fieldName => {
		let candidate = extractCandidateFromField(fieldName);
		candidateTotals[candidate] += document.getElementById(fieldName).valueAsNumber;
	});
	// populate ranking
	candidateNames.forEach( candidateName => {
		ranking.push([candidateName, candidateTotals[candidateName]]);		
	});
	// sort ranking
	ranking.sort( (a, b) => {
		return a[1] - b[1];	
	});
	// return candidateTotals and the ranking of 
	// candidates in most-favored to least-favored order
	return [candidateTotals, ranking];
}

const svgSize = 600;
const nodeRadius = 30;
function drawMajorityGraph(ranking) {
	// draw the majority graph as a circle shape
	let graphAngle = (2 * Math.PI) / ranking.length;
	let currentAngle = 0;
	let graphRadius = svgSize / 4;
	let svgCenter = [svgSize/2, svgSize/2];
	let graphedRanking = [];
	// calculate node positions
	ranking.forEach( candidateRank => {
			// swap x and y so the most-favored candidate
			// is in the 12 o'clock position
			let x = svgCenter[0] + graphRadius * Math.sin(currentAngle);
			let y = svgCenter[1] - graphRadius * Math.cos(currentAngle);
			let candidate = {"name":candidateRank[0], 
				             "rank":candidateRank[1],
				             "x":x,
				             "y":y};			
			graphedRanking.push(candidate);
			currentAngle += graphAngle;
	});
	console.log("graphedRanking is:");console.log(graphedRanking);
	let majorityGraphSvg = d3.select("#majority-graph")
							 .append("svg")
							 .attr("width", svgSize)
							 .attr("height", svgSize);
	let nodes = majorityGraphSvg.selectAll("circle")
								.data(graphedRanking)
								.enter()
								.append("circle")
								.attr("cx", d => d.x)
								.attr("cy", d => d.y)
								.attr("r", nodeRadius)
								.style("fill", "blue");
	let nodeLabels = majorityGraphSvg.selectAll("text")
									 .data(graphedRanking)
									 .enter()
									 .append("text")
									 .text(d => d.name)
									 .attr("font-size", 16)
									 .style("fill", "white")
									 .attr("x", d => d.x - (nodeRadius / 2))
									 .attr("y", d => d.y);
	
}

function submit() {
    let valid = true;
    voterNames.forEach( voterName => {
        if (!validateVoter(voterName)) {
            alert("Invalid votes present for " + printVoterName(voterName) + "!  Correct highlighted cells.");
            valid = false;
        }
    });
    if (valid) {
    	let [candidateTotals, ranking] = calculateRanking();
    	console.log(ranking);
    	drawMajorityGraph(ranking);
    }
}
