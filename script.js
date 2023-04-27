const form = document.querySelector('form'),
  fileInput = form.querySelector('.file-input'),
  progressArea = document.querySelector('.progress-area'),
  uploadedArea = document.querySelector('.uploaded-area')

form.addEventListener('click', () => {
  fileInput.click()
})

fileInput.onchange = ({ target }) => {
  let file = target.files[0] //getting file and [0] this means if user has selected multiples files then get first one only
  if (file) {
    //if file is selected
    let fileName = file.name //getting selected file name
    if (fileName.length >= 12) {
      //if filename length is greater or equal to 12 the split the name and add...
      let splitName = fileName.split('.')
      fileName = splitName[0].substring(0, 12) + '... .' + splitName[1]
    }
    uploadFile(fileName) //calling uploadFile with passing file name as an argument
  }
}

function uploadFile(name) {
  let xhr = new XMLHttpRequest() //creating a new xml obj (AJAX)
  xhr.open('POST', 'php/upload.php') //sending post request to the specified URL/File
  xhr.upload.addEventListener('progress', ({ loaded, total }) => {
    let fileLoaded = Math.floor((loaded / total) * 100) //getting percentage of loaded file size
    let fileTotal = Math.floor(total / 1000) // getting file size in KB from bytes
    let fileSize
    //if file size is less than 1024 then add only KB else convert size into KB to MB
    fileTotal < 1024
      ? (fileSize = fileTotal + 'KB')
      : (fileSize = loaded / (1024 * 1024)).toFixed(2) + 'MB'
    let progressHTML = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content">
                            <div class="details">
                              <span class="name">${name} • Uploading </span>
                              <span class="percent">${fileSize}%</span>
                            </div>
                            <div class="progress-bar">
                              <div class="progress" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`
    uploadedArea.classList.add('onprogress')
    uploadedArea.innerHTML = ''
    progressArea.innerHTML = progressHTML
    if (loaded === total) {
      progressArea.innerHTML = ''
      let uploadedHTML = `  <li class="row">
                            <div class="content">
                              <i class="fas fa-file-alt"></i>
                              <div class="details">
                                <span class="name">${name} • Uploaded </span>
                                <span class="size">${fileTotal}</span>
                              </div>
                            </div>
                            <i class="fas fa-check"></i>
                          </li>`
      uploadedArea.classList.remove('onprogress')
      uploadedArea.innerHTML = uploadedHTML
      //uploadedArea.insertAdjacentHTML('afterbegin', uploadedHTML)
    }
  })
  let formData = new FormData(form) //formData is an object to easily send form data
  xhr.send(formData) //sending form data to php
}
