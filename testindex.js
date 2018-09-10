var reader;
var progress = document.querySelector('.percent');
function abortRead() {  reader.abort(); }

function handleFileSelect(evt) {  
  // Reset progress indicator on new file selection.
  // progress.style.width = '0%';
  // progress.textContent = '0%';

  reader = new FileReader();
  reader.onerror = errorHandler;
  reader.onprogress = updateProgress;
  reader.onabort = function(e) {
    alert('File read cancelled');
  };
  // console.log("evt before onloadstart: ", evt)
  reader.onloadstart = function(e) {
    document.getElementById('progress_bar').className = 'loading';
  };  
  reader.onload = function(e) {
    // console.log("whatis evt: ", evt)
    console.log("filename from evt: ", evt.target.files[0].name)

    // Ensure that the progress bar displays 100% at the end.
    progress.style.width = '100%';
    //progress.textContent = '100%';
    setTimeout("document.getElementById('progress_bar').className='';", 2000);
    //var reader = new NetCDFReader(reader.result); //for Node.js ?

    //pass this.result (=ArrayBuffer of length 464692 bytes) to netcdfjs()
    // console.log("this: ", this)
    console.log("this.result: ", this.result)
    reader = new netcdfjs(this.result);


    console.log("reader: ", reader); //shows correct size of lat and lon
    // reader.getDataVariable('wmoId'); // go to offset and read it

    var ncvar = "t2m"; //"lat"; //"precip6HourQCD"; //"staticIds"; //"t2m"; //"wmoId"; //"t2m"; //
    var dataArray = reader.getDataVariable(ncvar); //variable array returned by getDataVariable()
    
    console.log("reader.getDataVariable(ncvar): ", dataArray);
    console.log("reader.getDataVariable(ncvar) month 0: ", dataArray[0]);
    // console.log("reader.header.recordDimension: ", reader.recordDimension)
    // console.log("reader.header.dimensions: ", reader.dimensions)

    
    console.log("reader.getDataVariable for lat LENGTH: ", reader.getDataVariable("lat").length)
    var nx = reader.getDataVariable("lat").length;
    var ny = reader.getDataVariable("lon").length;
    var la1 = 90, la2 = -90, lo1 = -180, lo2 = 180; //FIXED
    var dx = 360/nx, dy = 180/ny;
    

    var timeStamp = reader.header.globalAttributes.find(function (val) {
      return val.name === "timeStamp";
    }).value;
    console.log("timeStamp: ", timeStamp)

    fvar.style.width = '100%';
    fvar.textContent = 'nc variable to get: ' + ncvar;

   //... your program here  ..//
   //Create object from reader outputs
    const myObj = {
      header: {"nx": nx, "ny": ny},
      data: dataArray[0],
      meta: {"date": timeStamp}
    };

    //Convert to JSON format
    jsonData = JSON.stringify(myObj);
    console.log("jsonData: ", jsonData)
    console.log("[jsonData]: ", [jsonData])
    
    document.getElementById("id01").innerHTML = [jsonData];

    //end my code

  }
  reader.readAsArrayBuffer(evt.target.files[0]);
} //end handleFileSelect()

// Make input element <input type="file" id="files" name="file" />
var input = document.createElement("input");
input.id='files'
input.type = "file";
input.className = "file"; 
document.body.appendChild(input); // put it into the DOM

// Make input element <input type="file" id="files" name="file" />
var fvar = document.createElement("div");
fvar.id='fvarId'
document.body.appendChild(fvar); // put it into the DOM

// Display json obj
var id01 = document.createElement("div");
id01.id='id01'
document.body.appendChild(id01); // put it into the DOM


// Make a Progress bar <div id="progress_bar"><div class="percent">0%</div></div>
var progress = document.createElement("div");
progress.id='progress_bar';
inner = document.createElement("div");
inner.className = "percent";
inner.id='innerdiv' // set the CSS class
progress.appendChild(inner);
document.body.appendChild(progress); // put it into the DOM

//Start event listener to check if a file has been selected
run = document.getElementById('files').addEventListener('change', handleFileSelect, false);

///Progress bar and other functions 
function errorHandler(evt) {
  switch(evt.target.error.code) {
    case evt.target.error.NOT_FOUND_ERR:
      alert('File Not Found!'); break;
    case evt.target.error.NOT_READABLE_ERR:
      alert('File is not readable');break;
    case evt.target.error.ABORT_ERR: break;
    default: alert('An error occurred reading this file.');
  };
}

function updateProgress(evt) {
  // evt is an ProgressEvent. Updates progress bar
  if (evt.lengthComputable) {
    var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
    // Increase the progress bar length.
    if (percentLoaded < 100) {
      //progress.style.width = percentLoaded + '%';
      //progress.textContent = percentLoaded + '%';
    }
  }
}