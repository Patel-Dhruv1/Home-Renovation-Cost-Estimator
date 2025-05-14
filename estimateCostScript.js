

document.addEventListener("DOMContentLoaded", () => {
  //initializing the price for all fields...
  const pricingList = {
    projectDetails: {
     
      projectUrgency: {
        normal: 1.0,
        urgent: 1.02,
      },
      locationType: {
        urban: 1.0,
        rural: 1.02,
      },
    },
    "material&Design": {
      flooringType: {
        ceramic: 200,
        porcelain: 275,
        vitrified: 350,
        mosaic: 425,
        marble: 1000,
        granite: 1200,
        slate: 800,
        sandstone: 600,
        travertine: 1075,
        solid_hardwood: 1650,
        laminate: 400,
        bamboo: 800,
        engineered_wood: 1000,
        vinyle: 375,
        linoleum: 400,
        rubber: 550,
        Epoxy: 1300,
      },
      wallFinish: {
        emulsion: 230,
        distemper: 75,
        textured: 225,
        enamel: 185,
        vinyle: 350,
        fabric: 500,
        metallic: 650,
        wood: 850,
        pvc: 550,
        acoustic: 1050,
      },
      ceilingType: {
        flat: 115,
        drop: 300,
        coffered: 850,
        tray: 650,
        beam: 1050,
        pop: 375,
        gypsum: 325,
        wooden: 1250,
        metal: 700,
      },
    },
    "labor&Service": {
      labourQuality: {
        basic: 0.8,
        standard: 1.0,
        premium: 1.35,
      },
      electricWork: {
        basic: 835,
        standard: 1175,
        premium: 1435,
        nothing: 0,
      },
      plumberingWork: {
        pvc: 650,
        cpvc: 900,
        copper: 1600,
        nothing: 0,
      },
    },
  };

  //grabbing form
  const costForm = document.getElementById("cost-input-form");

  //intial cost values
  let totalFlooringCost = 0;
  let totalWallFinishingCost = 0;
  let totalCeilingCost = 0;
  let totalMaterialDesignCost = 0;
  let totalElectricalWorkCost = 0;
  let totalPlumbingWorkCost = 0;
  let totalRenovationCost = 0;
  let totalLaborCost = 0;
  let totalElecPlumbCost = 0;
  let finalizedFormData = [];
  const mainScreen = document.getElementById('mainScreen')
  const pamphlet = document.getElementById("pamphlet");
  const content = document.getElementById('content');
  const buttons = document.getElementById('buttons');
  const finalMessage = document.getElementById('finalMessage')
  //Listening to subimit event
  costForm.addEventListener("submit", (e) => {
    e.preventDefault();
    finalizedFormData = [];
    //getting field values from the form
    const renovationType = document.getElementById("renovation-type").value;
    const roomArea = parseFloat(
      document.getElementById("room-area").value
    ).toFixed(2);
    const wallArea = parseFloat(
      document.getElementById("wall-area").value
    ).toFixed(2);
    const projectUrgency = document.getElementById("project-uregency").value;

    const flooringType = document.getElementById("flooring-type").value;
    const wallFinishingType = document.getElementById("wall-finish-type").value;
    const ceilingType = document.getElementById("ceiling-type").value;
    const labourQuality = document.getElementById("labor-quality").value;
    const electricWork = document.getElementById("electrical-work").value;
    const numOfElectricalPoints = parseInt(
      document.getElementById("num-electrical-point").value
    );
    const numOfPlumberingPoints = parseInt(
      document.getElementById("num-plumbering-point").value
    );
    const plumberWork = document.getElementById(
      "plumbering-work-material"
    ).value;
    const budget = parseFloat(document.getElementById("budget").value).toFixed(
      2
    );
    console.log(numOfPlumberingPoints);
    //calculating cost
    totalFlooringCost =
      pricingList["material&Design"].flooringType[flooringType] * roomArea;
    totalCeilingCost =
      pricingList["material&Design"].ceilingType[ceilingType] * roomArea;
    totalWallFinishingCost =
      pricingList["material&Design"].wallFinish[wallFinishingType] * wallArea;
    totalLaborCost =
      pricingList["labor&Service"].labourQuality[labourQuality] *
      (parseFloat(roomArea) + parseFloat(wallArea));
    totalMaterialDesignCost =
      totalFlooringCost +
      totalCeilingCost +
      totalWallFinishingCost +
      totalLaborCost;

    totalElectricalWorkCost =
      pricingList["labor&Service"].electricWork[electricWork] *
      numOfElectricalPoints;
    totalPlumbingWorkCost =
      pricingList["labor&Service"].plumberingWork[plumberWork] *
      numOfPlumberingPoints;
    totalElecPlumbCost = totalElectricalWorkCost + totalPlumbingWorkCost;

    totalRenovationCost =
      (totalMaterialDesignCost + totalElecPlumbCost) *
      pricingList["projectDetails"].projectUrgency[projectUrgency];

    //creating object for each details to store in array..
    let selectedMaterial = {
      flooringMaterial: flooringType,
      ceilingMaterial: ceilingType,
      wallFinishingMaterial: wallFinishingType,
    };
    let selectedRoomArea = {
      wallArea: wallArea,
      roomArea: roomArea,
    };

    let selectedRenovationArea = {
      renoationArea: renovationType,
    };
    let selectedLabourQuality = {
      labourQuality: labourQuality,
    };
    let selectedPlumberingWork = {
      plumberingMaterial: plumberWork,
      points: numOfPlumberingPoints,
    };
    let selectedElectricalWork = {
      MaterialStandard: electricWork,
      points: numOfElectricalPoints,
    };
    let calculatedCost = {
      flooringCost: totalFlooringCost,
      ceilingCost: totalCeilingCost,
      wallFinishCost: totalWallFinishingCost,
      mAndDCost: totalMaterialDesignCost,
      electricalCost: totalElectricalWorkCost,
      plumberingCost: totalPlumbingWorkCost,
      totalCost: totalRenovationCost,
      totalLaborCost: totalLaborCost.toFixed(2),
      totalElecPlumbCost: totalElecPlumbCost,
    };
    let selectedBudget = {
      budget: budget,
    };

    //pushing objects into finalized data array which stores all cost related Data
    finalizedFormData.push(
      selectedBudget,
      selectedElectricalWork,
      selectedLabourQuality,
      selectedMaterial,
      selectedPlumberingWork,
      selectedRenovationArea,
      calculatedCost,
      selectedRoomArea
    );

    //calling display estimation function which takes finalizedFormData as argument
    displayEstimation(finalizedFormData);
  });

  function displayEstimation(data) {
    // estimationReportBox.classList.remove("hidden");
    // estimationReportBox.classList.add("flex");
    buttons.innerHTML = ""
    pamphlet.classList.add('flex');
    pamphlet.classList.remove('hidden');
    mainScreen.classList.add('blur-md')
    content.innerHTML = `
    <div id="box1" class="col-start-1 col-end-7 row-start-1 row-end-13 border-2 rounded-md  bg-orange-300 font-normal text-cyan-950 border-none"><p>Renovation Area: ${data[5].renoationArea} </p>
            <p>Room Area(Sq.ft): ${data[7].roomArea} </p>
        <p>Wall Area(Sq.ft): ${data[7].wallArea}</p>
    <p>Flooring Material: ${data[3].flooringMaterial}</p>
<p>Wall Finishing Material: ${data[3].wallFinishingMaterial} </p>
<p>Ceiling Material: ${data[3].ceilingMaterial}</p>
<p>Labour Quality: ${data[2].labourQuality} </p><p>Electrical Work: ${data[1].MaterialStandard}</p><p>Electrical Points: ${data[1].points}</p>
<p>Plumbering Material: ${data[4].plumberingMaterial}</p>
<p>Plumbering Points: ${data[4].points}</p></div>
            <div id="box2" class="col-start-7 col-end-13 row-start-1 row-end-7 border-2 rounded-md  bg-orange-300 font-normal text-cyan-950 border-none"><p>Flooring Cost: ${data[6].flooringCost}</p>
            <p>Wall Finishing Cost: ${data[6].wallFinishCost}</p>
        <p>Ceiling Cost: ${data[6].ceilingCost}</p>
    <p>Total Labour Cost: ${data[6].totalLaborCost}</p>
<p>Electrical & Plumbering Cost: ${data[6].totalElecPlumbCost}</p></div>
            <div id="box3" class="col-start-7 col-end-13 row-start-7 row-end-13 border-2 rounded-md  bg-orange-300 font-normal text-cyan-950 border-none"><p>Budget: ${data[0].budget}</p>
            <p>Total Cost: ${data[6].totalCost}</p></div>
        </div>
        `;
   

    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add(
      "bg-blue-400",
      "p-1",
      "rounded-md",
      "w-14",
      "hover:bg-blue-600"
    );
    cancelBtn.innerText = 'Cancel';
    cancelBtn.addEventListener('click' ,()=>{
      pamphlet.classList.add("hidden");
      pamphlet.classList.remove("flex");
      mainScreen.classList.remove('blur-md')
    })
    buttons.appendChild(cancelBtn)
    if (data[0].budget < data[6].totalCost) {
      finalMessage.innerText =
        "You are low on budget! Try to do some compromises";
    } else {
      finalMessage.innerText =
        "Congrats! you have enough budget for renovation";
    }
    
   
      }
    });

