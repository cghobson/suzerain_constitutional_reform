const decisions = [
    { 
        name: "Decrees Issue", 
        type: "dropdown", 
        dictator_options: ["-- Choose --", "Decrees Require Enabling Act", "No Decrees", "No Change", "Strengthened Decrees"],
        reformist_options: ["-- Choose --", "Decrees Require Enabling Act", "No Decrees", "No Change"]
    },
    { 
        name: "Vetoes", 
        type: "dropdown", 
        dictator_options: ["-- Choose --", "No Change", "3/5 Override", "Pocket Veto"],
        reformist_options: ["-- Choose --", "3/5 Override", "No Veto"]
    }
];

const blocs = [
    "PFJP",
    "USP Reformists",
    "USP Centrists",
    "Independents",
    "USP Conservatives",
    "NFP"
];

const blocPreferences = {
    "PFJP": {
        "Decrees Issue": {
            "like": ["Decrees Require Enabling Act", "No Decrees"],
            "hate": ["No Change", "Strengthened Decrees"]
        },
        "Vetoes": {
            "like": ["3/5 Override", "No Veto"],
            "hate": ["Pocket Veto", "No Change"]
        }
    },
    "USP Reformists": {
        "Decrees Issue": {
            "like": ["Decrees Require Enabling Act", "No Decrees"],
            "hate": ["No Change", "Strengthened Decrees"]
        },
        "Vetoes": {
            "like": ["3/5 Override", "No Veto"],
            "hate": ["Pocket Veto", "No Change"]
        }
    },
    "USP Centrists": {
        "Decrees Issue": {
            "like": ["Decrees Require Enabling Act", "No Change", "No Decrees"],
            "hate": ["Strengthened Decrees"]
        },
        "Vetoes": {
            "like": ["3/5 Override"],
            "ambivalent": ["No Veto", "Pocket Veto"],
            "hate": ["No Change"]
        }
    },
    "USP Conservatives": {
        "Decrees Issue": {
            "ambivalent": true
        }
    },
    "Independents": {
        "Decrees Issue": {
            "ambivalent": true
        },
        "Vetoes": {
            "ambivalent": true
        }
    },
    "NFP": {
        "Decrees Issue": {
            "ambivalent": true
        },
        "Vetoes": {
            "ambivalent": true
        }
    }
};

function setupSelection() {
    const selectionDiv = document.createElement("div");
    selectionDiv.style.marginBottom = "20px";
    selectionDiv.innerHTML = `<label>Select Mode: </label>`;
    const select = document.createElement("select");
    select.innerHTML = `<option value="">-- Choose --</option>
                        <option value="dictator">Dictator</option>
                        <option value="reformist">Reformist</option>`;
    select.addEventListener("change", event => initializeTable(event.target.value));
    selectionDiv.appendChild(select);
    document.body.prepend(selectionDiv);
}

function initializeTable(mode) {
    if (!mode) return;
    
    decisions.forEach(decision => {
        decision.options = mode === "dictator" ? decision.dictator_options : decision.reformist_options;
    });
    
    createTable();
}

function createTable() {
    const existingTable = document.querySelector("table");
    if (existingTable) existingTable.remove();
    
    const table = document.createElement("table");
    table.border = "1";
    
    const headerRow = document.createElement("tr");
    const nameHeader = document.createElement("th");
    nameHeader.innerText = "Decision";
    headerRow.appendChild(nameHeader);
    
    const choiceHeader = document.createElement("th");
    choiceHeader.innerText = "Choice";
    headerRow.appendChild(choiceHeader);
    
    blocs.forEach(bloc => {
        const th = document.createElement("th");
        th.innerText = bloc;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    
    decisions.forEach(decision => {
        const row = document.createElement("tr");
        
        const nameCell = document.createElement("td");
        nameCell.innerText = decision.name;
        row.appendChild(nameCell);
        
        const choiceCell = document.createElement("td");
        const select = document.createElement("select");
        decision.options.forEach(option => {
            const optionElement = document.createElement("option");
            optionElement.value = option;
            optionElement.innerText = option;
            select.appendChild(optionElement);
        });
        select.addEventListener("change", (event) => updateVotes(row, decision.name, event.target.value));
        choiceCell.appendChild(select);
        row.appendChild(choiceCell);
        
        blocs.forEach(bloc => {
            const cell = document.createElement("td");
            cell.dataset.bloc = bloc;
            row.appendChild(cell);
        });
        
        table.appendChild(row);
    });
    
    document.body.appendChild(table);
}

function updateVotes(row, decisionName, selectedOption) {
    row.querySelectorAll(`td[data-bloc]`).forEach(cell => {
        const bloc = cell.dataset.bloc;
        const preferences = blocPreferences[bloc][decisionName] || {};
        
        if (preferences.ambivalent) {
            cell.innerText = "➖";
        } else if (preferences.like && preferences.like.includes(selectedOption)) {
            cell.innerText = "✔";
        } else if (preferences.hate && preferences.hate.includes(selectedOption)) {
            cell.innerText = "✘";
        } else {
            cell.innerText = "➖";
        }
    });
}

window.onload = setupSelection;
