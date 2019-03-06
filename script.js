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

function setVoterTableToPreference(preferenceString) {
    if (preferenceString !== "") {
        // console.log("preferenceString is: " + preferenceString);
        let [highCandidate, , lowCandidate] = preferenceString.split("-");
        console.log("highCandidate is: " + highCandidate + ", lowCandidate is: " + lowCandidate);
        voterNames.forEach( voterName => {
            let highKey = voterName + "-" + highCandidate + "-vote"; 
            let lowKey = voterName + "-" + lowCandidate + "-vote"; 
            let highValue = document.getElementById(highKey).value;
            let lowValue = document.getElementById(lowKey).value;
            if (lowValue > highValue) {  // swap if needed
                console.log("Swapping " + highKey + "=" + highValue + " with " + lowKey + "=" + lowValue);
                document.getElementById(highKey).value = lowValue;
                document.getElementById(lowKey).value = highValue;
            }
        });
    }
}
