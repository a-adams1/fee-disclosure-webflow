let hContainer, pdfFileName, pdfData, dataArray;
const subbutton = document.querySelector('#submit-Button');
subbutton.addEventListener('click', function () {
document.getElementById('first-page').style.display = 'none';
hContainer = document.querySelector('.container h1');
hContainer.textContent = "Fee disclosure analysis";
hContainer.style.textAlign = "left";
hContainer.style.paddingLeft = "10px";
if (document.getElementById('file-name').innerHTML.trim() !== '') {
  this.disabled = true;
  submitButton();}});
function submitButton() {
var fileInput = document.getElementById('file');
const file = fileInput.files[0];
  pdfFileName = file.name;
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function() {
      let base64data = reader.result.split(',')[1];
      pdfData = base64data; 
  var formData = new FormData();
  formData.append("pdf_file", file);
  sendDataToAPI(formData, pdfData);} }

function truncateFilenameTwo(filename, maxCharsPerLine = 21) {
        const maxLength = 2 * maxCharsPerLine;
        if (filename.length > maxLength) {
          return filename.substr(0, maxLength - 1) + "...";}
        return filename;}

function sendDataToAPI(formData, fromPdf) {
        let periodCount = 1;
        const updateCalculatingText = () => {
            let text = 'Calculating ';
            for (let i = 0; i < periodCount; i++) {text += '.';}
            document.getElementById('calculatingText').innerHTML = text;
            periodCount = (periodCount % 3) + 1;};
        let intervalID = setInterval(updateCalculatingText, 500);
        const uniqueId = Date.now().toString();
        console.log(uniqueId);
        formData.append('unique_id', uniqueId);
  fetch('https://z96gyadf7b.execute-api.us-east-1.amazonaws.com/fee-disclosure-stage/hubspot', {
        method: 'POST',
        body: JSON.stringify({ file: fromPdf, fileName: pdfFileName, emailAddress: 'marketing@forusall.com', uniqueID: uniqueId}),
        headers: {'Content-Type': 'application/json'}})
        .then(response => response.json()).then(data => {console.log(data);})
        .catch(error => {console.log(error);});
        fetch('https://marketing.forusall.com/api/analyze-pdf', {
             method: 'POST',
             mode: 'cors',
             body: formData})
     	    .then(response => response.json())
          .then(data => {
          	console.log(data);
            dataArray = data;
          	let feePart, totAssets, netInv, advFee, totAdmin, totInvFee, revShare, propFund, totCost;

            function isNegative(value) {
                const pattern = /-\d+(\.\d+)?/;
                return pattern.test(value);
            }
            data.fees.forEach(fee => {
              console.log(fee.value);
              if (isNegative(fee.value)) {
                  fee.value = 'TBD';
              } else if (fee.percentage) {
                  fee.value += ' (' + fee.percentage + ')';
              }
          
              switch (fee.name) {
                  case "Total Participants":
                      feePart = fee.value;
                      break;
                  case "Total Assets":
                      totAssets = fee.value;
                      break;
                  case "Prop Funds":
                      propFund = fee.value;
                      break;
                  case "Net Investments":
                      netInv = fee.value;
                      break;
                  case "Total Admin":
                      totAdmin = fee.value;
                      break;
                  case "Total Investment Fee":
                      totInvFee = fee.value;
                      break;
                  case "Revenue Share":
                      revShare = fee.value;
                      break;
                  case "Adviser Fee":
                      advFee = fee.value;
                      break;
                  case "Total Cost":
                      totCost = fee.value;
                      break;
              } });

            let fees = ['Plan Name', 'Provider', 'Plan Assets', 'Total Participants'];
            let planName = truncateFilenameTwo(data.plan);
            let values = [planName, data.provider, totAssets, feePart];
            const details = document.getElementById('plancontent');
            
            fees.forEach((item, index) => {
                let listvalue = values[index];
                const feeDiv = document.createElement('div');
                feeDiv.className = 'fee-item';
                if (index !== fees.length - 1) {
                    feeDiv.style.marginBottom = '20px';
                }
            
                if (item === 'Plan Assets' || item === 'Total Participants') {
                    const span = document.createElement('span');
                    span.id = `display-${item}`;
                    span.textContent = listvalue;
                    feeDiv.appendChild(span);
                  
                    let itemwithoutDollar = listvalue.replace('$', '');
                    const inputWrapper = document.createElement('div');
                    inputWrapper.className = 'input-icon-container';


                  
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.id = `input-${item}`;
                    input.className = 'editable-input';
                    input.value = itemwithoutDollar;
                    input.style.display = 'none';
                    inputWrapper.appendChild(input);
            
                    const pencilIcon = document.createElement('i');
                    pencilIcon.className = 'fas fa-pencil-alt edit-icon';
                    inputWrapper.appendChild(pencilIcon);
            
                    feeDiv.appendChild(inputWrapper);
            
                    pencilIcon.addEventListener('click', function() {
                        document.getElementById("analysisButton").disabled = false;
                        span.style.display = 'none';
                        input.style.display = 'inline';
                        input.focus();
                    });
            
                    input.addEventListener('blur', function() {
                        span.textContent = input.value;
                        span.style.display = 'inline';
                        input.style.display = 'none';
                    });
                } else {

                    const value = document.createElement('p');
                    value.textContent = listvalue;
                    feeDiv.appendChild(value);
                }
                
                const name = document.createElement('name');
                name.textContent = item;
                feeDiv.appendChild(name);
                details.appendChild(feeDiv);
            });

            let fees2 = ['Revenue Share', 'Total Investment Fee', 'Proprietary Product']
            let values2 = [revShare, totInvFee, propFund]
          	const details2 = document.getElementById('plancontent2');
            fees2.forEach((item, index) => {
            	let listvalue = values2[index];
              const feeDiv = document.createElement('div');
              feeDiv.className = 'fee-item';
              if (index !== fees2.length - 1) {
                feeDiv.style.marginBottom = '20px';}
              const value = document.createElement('p');
              value.textContent = listvalue;
              feeDiv.appendChild(value);
              const name = document.createElement('name');
              name.textContent = item;
              feeDiv.appendChild(name);
              details2.appendChild(feeDiv);});
            let fees3 = ['RK', 'Advisor', 'Net Investments', 'Total']
            let values3 = [totAdmin, advFee,netInv, totCost]
          	const details3 = document.getElementById('plancontent3');
            fees3.forEach((item, index) => {
            	let listvalue = values3[index];
              const feeDiv = document.createElement('div');
              feeDiv.className = 'fee-item';
              const value = document.createElement('p');
              value.textContent = listvalue;
              feeDiv.appendChild(value);
              const name = document.createElement('name');
              name.textContent = item;
              if (index !== fees3.length - 1) {
                feeDiv.style.marginBottom = '20px';}
              feeDiv.appendChild(name);
              if (index === values3.length - 1) {
                name.style.fontWeight = 'bold';
                name.style.fontSize = '20px';
                value.style.fontWeight = 'bold';
                value.style.fontSize = '20px';}
              details3.appendChild(feeDiv);});
            clearInterval(intervalID);
            document.getElementById('calculatingText').innerHTML = '';
            document.getElementById('infoBox').style.display = 'block';
            document.getElementById('summaryid').style.display = 'block'; 
            document.getElementById('plandet').style.display = 'block';
            document.getElementById('alterinfo').style.display = 'block';
            document.getElementById('second-description').style.display = 'block';
            document.getElementById('disclaimertwo-text').style.display = 'block';
            document.getElementById('buttonContainer').style.display = 'flex';
            var container = document.querySelector('.container');
            container.style.minWidth = '1000px';
            subbutton.disabled = false;}).catch(error => {
          clearInterval(intervalID);
          var columncontainer = document.querySelector('.columns-container');
          columncontainer.style.display = 'none';
          document.getElementById('calculatingText').innerHTML = '';
          document.getElementById('second-description').innerHTML = 'Unfortunately, there might have been an issue with the information you provided. But don’t worry! Our Fee Specialist team will review the information. Please enter your email below and we will send you the results once the review is complete.';
          document.getElementById('second-description').style.display = 'block';
          document.getElementById('second-description').style.textAlign = 'center';
          hContainer.style.textAlign = "center";
          document.getElementById('customForm').style.display = 'block';});}

function truncateFilename(filename, maxCharsPerLine = 40) {
        const maxLength = maxCharsPerLine;

        if (filename.length > maxLength) {
          return filename.substr(0, maxLength - 1) + "...";
        }
        return filename;
      }
function showFileName() {
        document.getElementById('infoBox').style.display = 'none';
        document.getElementById('result').innerHTML = '';
        var fileInput = document.getElementById('file');
        var fileNameDiv = document.getElementById('file-name');
        var submitButton = document.getElementById('submit-Button');
        if (fileInput.files.length > 0) {
          var fileName = fileInput.files[0].name;
          var truncateName = truncateFilename(fileName);
          fileNameDiv.innerHTML = '<strong>Selected file:</strong> ' + truncateName;
          submitButton.disabled = false;
        } else {
          fileNameDiv.innerHTML = 'No file selected';
          submitButton.disabled = true;
        }
      }
      var dropArea = document.getElementById('drop-area');
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
      });
      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }
      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
      });
      ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
      });
      function highlight() {
        dropArea.style.backgroundColor = '#f9f9f9';
      }
      function unhighlight() {
        dropArea.style.backgroundColor = '';
      }
      dropArea.addEventListener('drop', handleDrop, false);
      function handleDrop(e) {
        var dt = e.dataTransfer;
        var files = dt.files;
        document.getElementById('file').files = files;
        showFileName();
      }
