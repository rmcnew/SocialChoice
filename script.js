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

/************* Data Field Lists **************/
// names for the voter choices table fields
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

// names for the voter choices table voter weights
let weightNames = [
    "voter-a-weight",
    "voter-b-weight",
    "voter-c-weight",
    "voter-d-weight"];
 
// the voter names
let voterNames = [
    "voter-a",
    "voter-b",
    "voter-c",
    "voter-d"];

// the candidate names
let candidateNames = [
	"alex",
	"bart",
	"cindy",
	"david",
	"erik",
	"frank",
	"greg"];
     
// the default values for the voter choices table
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

// the default weights for the voter choices table
let defaultWeightValues = {
    "voter-a-weight": 5,
    "voter-b-weight": 4,
    "voter-c-weight": 3,
    "voter-d-weight": 6};

/************* Shared Utility Functions for Data Extraction, Formatting, and Input Validation **************/
// reset the voter choices table to default values
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

// get a random weight value
function getRandomWeight() {
    return Math.floor(Math.random() * Math.floor(10));
}

// get the default voter choices vector
function getVoterChoices() {
    return [1, 2, 3, 4, 5, 6, 7];
}

// choose a random vote from the remaining choices
// NOTE: this has a side effect of modifying the input vector
function randomChoice(voterChoices) {
    let index = Math.floor(Math.random() * Math.floor(voterChoices.length));
    return voterChoices.splice(index, 1);
}

// randomize the voter choices table
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

// "rotate" the votes for a single voter
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

// set the voter choices to reflect one candidate preferred above another
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

// validate the votes for a single voter
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

// convert the voter name into a printable string
function printVoterName(voterName) {
    return "Voter " + voterName.charAt(6).toUpperCase();
}

// extract the candidate name from the field
function extractCandidateFromField(field) {
	return field.split("-")[2];	
}

// extract the voter name from the field
function extractVoterFromField(field) {
    return field.slice(0, 7);
}

// convert the voter ranking to a score that we can use in the weighted calculation
function rankingToScore(ranking) {
    switch (ranking) {
        case 1: return 7;
        case 2: return 6;
        case 3: return 5;
        case 4: return 4;
        case 5: return 3;
        case 6: return 2;
        case 7: return 1;
    }
}


// get voter data as Voter classes 
// for use in ranking calculations
function extractVoterData() {
    let voterData = {};
    voterNames.forEach( name => {
        voterData[name] = {};
    });
    fieldNames.forEach( fieldName => {
        let name = extractVoterFromField(fieldName);
        // voterData[name]["name"] = name;
        let candidate = extractCandidateFromField(fieldName);
        let voterWeight = document.getElementById(extractVoterFromField(fieldName) + "-weight").valueAsNumber;
        let vote = rankingToScore(document.getElementById(fieldName).valueAsNumber) * voterWeight;
        voterData[name][candidate] = vote;
    });
    return voterData;
}

function objectify(arrayOfArrays) { 
	return arrayOfArrays.reduce( (o,[k,v]) => (o[k]=v,o), {} );
}

// make a deep copy clone of a Javascript object
function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// calculate rankings and show the results table
function showResults() {
    d3.select("#results").attr("hidden", null);
}

// create a hash of per-voter rankings
function calculatePerVoterRanking(voterData) {
    let perVoterRanking = {};
    voterNames.forEach( voterName => {
        let voterRanking = Object.entries(voterData[voterName]).sort( (a, b) => {
            return b[1] - a[1];	
        });
        perVoterRanking[voterName] = voterRanking;
    });
    //console.log("perVoterRanking is:");
    //console.log(perVoterRanking);
    return perVoterRanking;
}

/************* Majority Graph (Plurality) **************/
// calculate the plurality vote ranking 
// needed to construct the majority graph
function calculateRanking(voterData, candidates) {
	let ranking = [];
	let candidateTotals = {};
	// initialize candidate totals
	candidates.forEach( candidateName => {
		candidateTotals[candidateName] = 0;		
	});	
	// calculate totals from table
    candidates.forEach( candidateName => {
        voterNames.forEach ( voterName => {
            candidateTotals[candidateName] += voterData[voterName][candidateName];
        });
    });
	// populate ranking
	candidates.forEach( candidateName => {
		ranking.push([candidateName, candidateTotals[candidateName]]);		
	});
	// sort ranking
	ranking.sort( (a, b) => {
		return b[1] - a[1];	
	});
	// return candidateTotals and the ranking of 
	// candidates in most-favored to least-favored order
	return ranking;
}

const svgSize = 600;
const nodeRadius = 30;
const arrowBackSide = nodeRadius / 10;
const arrowLength = nodeRadius / 2; 

function drawMajorityGraph(ranking) {
	// draw the majority graph as a circle shape
	let graphAngle = (2 * Math.PI) / ranking.length;
	let currentAngle = 0;
	let graphRadius = svgSize / 4;
	let svgCenter = [svgSize/2, svgSize/2];
	let graphedRanking = [];
    let edgePoints = [];
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
    // calculate edge positions
    for (let i = 0; i < graphedRanking.length; i++) {
        for (let j = i + 1; j < graphedRanking.length; j++) {
            let vector = [graphedRanking[j]["x"] - graphedRanking[i]["x"], graphedRanking[j]["y"] - graphedRanking[i]["y"]];
            let vectorMagnitude = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
            let unitVector = [vector[0] / vectorMagnitude, vector[1] / vectorMagnitude];
            let from = {"x": graphedRanking[i]["x"], "y": graphedRanking[i]["y"]};
            let to = {"x": graphedRanking[j]["x"] - (nodeRadius * unitVector[0]), 
                      "y": graphedRanking[j]["y"] - (nodeRadius * unitVector[1])};
            let leftPerpVector = [-unitVector[1], unitVector[0]];
            let rightPerpVector = [unitVector[1], -unitVector[0]];
            let leftArrowhead = {"from": to, 
                                   "to": {"x":to["x"] - (unitVector[0] * arrowLength) + (leftPerpVector[0] * arrowBackSide),
                                          "y":to["y"] - (unitVector[1] * arrowLength) + (leftPerpVector[1] * arrowBackSide)},
                                "class": graphedRanking[i]["name"]};
            let rightArrowhead = {"from": to, 
                                   "to": {"x":to["x"] - (unitVector[0] * arrowLength) + (rightPerpVector[0] * arrowBackSide),
                                          "y":to["y"] - (unitVector[1] * arrowLength) + (rightPerpVector[1] * arrowBackSide)},
                                "class": graphedRanking[i]["name"]};
            edgePoints.push(leftArrowhead);
            edgePoints.push(rightArrowhead);
            edgePoints.push({"from": from, "to": to, "class": graphedRanking[i]["name"]});
        }
    }
	// console.log("graphedRanking is:");
    // console.log(graphedRanking);
    // console.log("edgePoints is:");
    // console.log(edgePoints);
    // delete the existing graph if there was one
    d3.select("#majority-graph svg").remove();
    // draw the majority graph
	let majorityGraphSvg = d3.select("#majority-graph")
							 .append("svg")
							 .attr("width", svgSize)
							 .attr("height", svgSize);
    let edges = majorityGraphSvg.selectAll("line")
                                .data(edgePoints)
                                .enter()
                                .append("line")
                                .attr("x1", d => d["from"]["x"])
                                .attr("y1", d => d["from"]["y"])
                                .attr("x2", d => d["to"]["x"])
                                .attr("y2", d => d["to"]["y"])
                                .attr("class", d => d["class"]);
	let nodes = majorityGraphSvg.selectAll("circle")
								.data(graphedRanking)
								.enter()
								.append("circle")
								.attr("cx", d => d.x)
								.attr("cy", d => d.y)
								.attr("r", nodeRadius)
                                .attr("class", d => d.name);
	let nodeLabels = majorityGraphSvg.selectAll("text")
									 .data(graphedRanking)
									 .enter()
									 .append("text")
									 .text(d => d.name)
                                     .attr("class", "label") 
									 .attr("x", d => d.x)
									 .attr("y", d => d.y + nodeRadius/6 );
	
    d3.select("#majority-graph").attr("hidden", null);
}

function updateMajorityGraphResults(ranking) {
    for (let entry of ranking.entries()) {
        d3.select("#majority-graph-" + (entry[0] + 1))
            .text(entry[1][0])
            .attr("class", entry[1][0]);
    }
}


/************* Single Transferrable Vote **************/
function calculateSingleTransferrableVote(voterData) {
    let svtResult = [];
    let candidates = candidateNames.slice();
    for (let i = 0; i < candidateNames.length; i++) {
        let ranking = calculateRanking(voterData, candidates);
        let lowestCandidate = ranking.pop()[0];
        //console.log("lowestCandidate is: " + lowestCandidate);
        svtResult.unshift(lowestCandidate);
        // remove the lowest candidate from the list of candidates
        let lowestCandidateIndex = candidates.indexOf(lowestCandidate);
        candidates.splice(lowestCandidateIndex, 1);
        // update the voter records, removing the lowest candidate
        // and reallocating the vote to the next preferred candidate
        // for the voter
        voterNames.forEach( voterName => {
            // get the vote for the lowest candidate
            let vote = voterData[voterName][lowestCandidate];
            // remove the candidate from the voter's record 
            delete voterData[voterName][lowestCandidate];
            let highestCandidate = null
            let highestVote = 0;
            candidates.forEach( candidateName => {
                if (voterData[voterName][candidateName] > highestVote) {
                    highestVote = voterData[voterName][candidateName];
                    highestCandidate = candidateName;
                }
            });
            voterData[voterName][highestCandidate] = vote + highestVote;
        });
    }
    return svtResult; 
}


// put Single Transferrable Vote results in output table
function updateSingleTransferrableVoteResults(svtResult) {
    for (let entry of svtResult.entries()) {
        d3.select("#single-transferrable-vote-" + (entry[0] + 1))
            .text(entry[1])
            .attr("class", entry[1]);
    }
}

/************* Second Order Copeland **************/
// calculate the Second Order Copeland results
function calculateSecondOrderCopeland(voterData) {
	let candidateTotals = objectify(calculateRanking(voterData, candidateNames));
    let winsLosses = {};
    // initialize wins and losses
    candidateNames.forEach( candidate => {
        winsLosses[candidate] = {"wins": 0, "losses": 0, "net": 0, "prevailedAgainst":[], "competitorsNet": 0};
    });
     
    // calculate pairwise wins and losses
    candidateNames.forEach( candidateA => {
        candidateNames.forEach( candidateB => {
            if (candidateA !== candidateB) {
              	let scoreA = candidateTotals[candidateA];
				let scoreB = candidateTotals[candidateB]; 
				if (scoreA > scoreB) {
					winsLosses[candidateA]["wins"]++; 	
					winsLosses[candidateB]["losses"]++;
					winsLosses[candidateA]["prevailedAgainst"].push(candidateB);
				} else {
					winsLosses[candidateB]["wins"]++; 	
					winsLosses[candidateA]["losses"]++;
					winsLosses[candidateB]["prevailedAgainst"].push(candidateA);
				}
            }
        });
    });
	// determine results
	// calculate net wins
	candidateNames.forEach( candidate => {
		winsLosses[candidate]["net"] = winsLosses[candidate]["wins"] - winsLosses[candidate]["losses"];		 
	});
	// calculate sum of defeated competitors' nets (second order Copeland)
	candidateNames.forEach( candidate => {
		winsLosses[candidate]["prevailedAgainst"].forEach( losingCandidate => {
			winsLosses[candidate]["competitorsNet"] += winsLosses[losingCandidate]["net"];
		});
	});	
	// check for winner or ties
	let ordered = Object.entries(winsLosses).sort( (a, b) => {
		if (b[1]["net"] === a[1]["net"]) { 
			return b[1]["competitorsNet"] - a[1]["competitorsNet"];
		} else { 
			return b[1]["net"] - a[1]["net"];
		} 
	});
	//console.log(ordered);
	return ordered;
}

// put Second Order Copeland results into results table
function updateSecondOrderCopelandResults(results) {
    for (let entry of results.entries()) {
        d3.select("#copeland-" + (entry[0] + 1))
            .text(entry[1][0])
            .attr("class", entry[1][0]);
    }
}


/************* Bucklin Ranking **************/
// check a ranking to see if the ranking leader
// has a majority of the votes (for Bucklin)
function majorityExists(perVoterRanking, k) {
    // initialize total and candidateTotals to zero
    let total = 0;
    let candidateTotals = {};
    candidateNames.forEach ( candidateName => {
        candidateTotals[candidateName] = 0;
    });
    // walk perVoterRanking to get votes for each candidate 
    voterNames.forEach( voterName => {
        candidateNames.forEach ( candidateName => {
            for (let index = 0; index < k; index++) {
                if (candidateName === perVoterRanking[voterName][index][0]) {
                    candidateTotals[candidateName] += perVoterRanking[voterName][index][1];
                    total += perVoterRanking[voterName][index][1];
                }
            }
        });
    });
    // sort candidateTotals to get a ranking
    let ranking = Object.entries(candidateTotals).sort( (a, b) => {
        return b[1] - a[1];	
    });
    //console.log("majorityExists ranking:");
    //console.log(ranking);
    // check top candidate for majority
    if ((ranking[0][1] / total) > 0.5) {
        //console.log("total is: " + total + ", majority is: true");
        return [true, ranking];
    } else {
        //console.log("total is: " + total + ", majority is: false");
        return [false, ranking];
    }
}


// calculate the Bucklin ranking
function calculateBucklin(voterData) {
    let k = 1;
    let perVoterRanking = calculatePerVoterRanking(voterData);
    let majorityFound = false;
    let bucklinRanking = null;
    for (k = 1; !majorityFound && k <= candidateNames.length; k++) {
        [majorityFound, bucklinRanking] = majorityExists(perVoterRanking, k);
    }
    //console.log("k is: " + k + ", majorityFound is: " + majorityFound);
    return [bucklinRanking, k];
}

function updateBucklinResults(bucklinRanking, k) {
    for (let index = 0; index < bucklinRanking.length; index++) {
        d3.select("#bucklin-" + (index + 1))
            .text(bucklinRanking[index][0])
            .attr("class", bucklinRanking[index][0]);
    }
    d3.select("#bucklin-header")
        .html("Bucklin<br/>K = " + k)
        .classed("results-header", true);
}

/************* Submit Button (Main) **************/
// validate the voter choices input data and then
// display the majority graph and results table
function submit() {
    let valid = true;
    voterNames.forEach( voterName => {
        if (!validateVoter(voterName)) {
            alert("Invalid votes present for " + printVoterName(voterName) + "!  Correct highlighted cells.");
            valid = false;
        }
    });
    if (valid) {
        // get the voterData from the Voter Choices input table
        let voterData = extractVoterData();
        //console.log("voterData is: ");
        //console.log(voterData);

        // calculate and update Majority Graph
    	let majorityGraphRanking = calculateRanking(voterData, candidateNames);
        //console.log("ranking is:");
    	//console.log(majorityGraphRanking);
    	drawMajorityGraph(majorityGraphRanking);
        updateMajorityGraphResults(majorityGraphRanking);

        // calculate and update Single Transferrable Vote
        let svtResult = calculateSingleTransferrableVote(cloneObject(voterData));
        //console.log("SVT result is: ");
        //console.log(svtResult);
        updateSingleTransferrableVoteResults(svtResult);

        // calculate and update Second Order Copeland
        let copelandResult = calculateSecondOrderCopeland(cloneObject(voterData));
		//console.log("copelandResult is: ");
		//console.log(copelandResult);
		updateSecondOrderCopelandResults(copelandResult);

        // calculate and update Bucklin
        let [bucklinRanking, k] = calculateBucklin(cloneObject(voterData));
        //console.log("bucklinRanking is:");
        //console.log(bucklinRanking);
        updateBucklinResults(bucklinRanking, k);

        showResults();
    }
}
