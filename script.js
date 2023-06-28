class Section {
    Name;
    Reserved;
    Capacity;
    Rows;

    constructor(name, reserved, capacity, rows) {
        this.Name = name;
        this.Reserved = reserved;
        this.Capacity = capacity;
        this.Rows = rows;
    }
}

const sectionArray = [];
let secG = new Section("G", 160, 280, 18);
sectionArray.push(secG);
let secHN = new Section("H - Nedre", 40, 150, 6);
sectionArray.push(secHN);
let secIN = new Section("I - Nedre", 140, 150, 6);
sectionArray.push(secIN);
let secJN = new Section("J - Nedre", 35, 150, 6);
sectionArray.push(secJN);
let secK = new Section("K", 230, 230, 18);
sectionArray.push(secK);
let secL = new Section("L", 50, 600, 18);
sectionArray.push(secL);
let secMF = new Section("M - Fan", 230, 300, 18);
sectionArray.push(secMF);
let secM = new Section("M", 350, 600, 18);
sectionArray.push(secM);

const buttonIDArray = ["sectionG", "sectionHN", "sectionIN", "sectionJN", "sectionK", "sectionL", "sectionMF", "sectionM"];

SetUpSectionButtons();

function SetUpSectionButtons() {
    for (let i = 0; i < sectionArray.length; i++) {
        SetSectionButtonText(buttonIDArray[i], sectionArray[i].Name);
        SetSectionButtonColourClass(buttonIDArray[i], sectionArray[i].Reserved, sectionArray[i].Capacity);

        $("#" + buttonIDArray[i]).on("mouseenter", function() {
            OnMouseEnter(i);
        });
        $("#" + buttonIDArray[i]).on("mouseleave", function() {
            OnMouseLeave(i);
        });
    }
}

function OnMouseEnter(buttonno) {
    let numberString = sectionArray[buttonno].Reserved + " / " + sectionArray[buttonno].Capacity;
    SetSectionButtonText(buttonIDArray[buttonno], numberString);
}

function OnMouseLeave(buttonno) {
    SetSectionButtonText(buttonIDArray[buttonno], sectionArray[buttonno].Name);
}

function SetSectionButtonText(buttonid, text) {
    $("#" + buttonid).text(text);
}

function SetSectionButtonColourClass(buttonid, current, capacity) {
    let classString;
    let percentage = current / capacity;

    if (percentage == 1)
        classString = "btn-dark";
    else if (percentage > 0.9)
        classString = "btn-danger";
    else if (percentage > 0.6)
        classString = "btn-warning";
    else
        classString = "btn-success";

    $("#" + buttonid).addClass(classString);
}
