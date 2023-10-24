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
        if (fileInput.files.length > 0) {
          var fileName = fileInput.files[0].name;
          var truncateName = truncateFilename(fileName);
          fileNameDiv.innerHTML = '<strong>Selected file:</strong> ' + truncateName;
        } else {
          fileNameDiv.innerHTML = 'No file selected';
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
