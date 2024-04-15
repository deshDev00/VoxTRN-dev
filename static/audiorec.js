const startRecordingButton = document.getElementById("startRecording");
const stopRecordingButton = document.getElementById("stopRecording");
const chatMessages = document.getElementById("chat-messages");
let mediaRecorder;
let audioChunks = [];
const serverAddress = 'https://3.130.175.176.nip.io'; 

function displayTranscriptionResult(data) {
  const transcriptionElement = document.createElement('div');
  transcriptionElement.textContent = data;
  transcriptionElement.classList.add('message');
  transcriptionElement.classList.add('bot-message');
  transcriptionElement.setAttribute('id', 'transcriptionResult'); 
  chatMessages.appendChild(transcriptionElement);

  
  if (!data.trim() && !document.querySelector('.button-container')) {
    const emptyAudioElement = document.createElement('div');
    emptyAudioElement.textContent = 'Empty audio received, try using the service again';
    emptyAudioElement.classList.add('message');
    emptyAudioElement.classList.add('empty-audio-message');
    chatMessages.appendChild(emptyAudioElement);
  } else {
    
    if (!document.querySelector('.button-container')) {
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('button-container');

      const correctButton = document.createElement('button');
      correctButton.textContent = 'Correct';
      correctButton.addEventListener('click', () => handleCorrectButton(data));

      const wrongButton = document.createElement('button');
      wrongButton.textContent = 'Wrong';
      wrongButton.addEventListener('click', handleWrongButton);

      buttonContainer.appendChild(correctButton);
      buttonContainer.appendChild(wrongButton);

      chatMessages.appendChild(buttonContainer);
    }
  }
}

function handleCorrectButton(data) {
  const messages = chatMessages.querySelectorAll('.message');
  const lastResponseIndex = messages.length - 1;
  if (lastResponseIndex >= 0) {
    messages[lastResponseIndex].remove();
  }
  const lastResponseContainer = chatMessages.lastElementChild;
  if (lastResponseContainer) {
    lastResponseContainer.remove();
  }
  
  const loadingElement = document.createElement('div');
  loadingElement.textContent = 'Translation in progress...';
  loadingElement.classList.add('message');
  loadingElement.classList.add('loading-message');
  chatMessages.appendChild(loadingElement);

  fetch(serverAddress +'/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-cache',
    body: JSON.stringify({ text: data })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Translation error! status: ${response.status}`);
    }
    return response.text();
  })
  .then(translatedText => {
    loadingElement.remove();

    const translationElement = document.createElement('div');
    translationElement.textContent = "Agent: " + translatedText;
    translationElement.classList.add('message');
    translationElement.classList.add('translated-message');
    chatMessages.appendChild(translationElement);

    appendCustomerMessage();
  })
  .catch(error => {
    console.error('Error translating:', error);
    
    loadingElement.textContent = 'Translation failed. Please try again.';
  });
}

function appendCustomerMessage() {
  const customerElement = document.createElement('div');
  customerElement.textContent = 'Customer: ' + 'this is demotext1'; 
  customerElement.classList.add('message');
  customerElement.classList.add('user-message');
  customerElement.setAttribute('id', 'transcriptionResultCustomer'); 
  chatMessages.appendChild(customerElement);
}

function handleWrongButton() {
  const transcriptionResult = document.getElementById('transcriptionResult');
  if (transcriptionResult) {
    transcriptionResult.remove(); 
    const buttonContainer = document.querySelector('.button-container');
    if (buttonContainer) {
      buttonContainer.remove(); 
    }
  }
}


if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function(stream) {
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = function(event) {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = function() {
        const audioBlob = new Blob(audioChunks, { 'type': 'audio/wav' });
        const audioURL = URL.createObjectURL(audioBlob);
        const formData = new FormData();
        formData.append('audio', audioBlob);

        fetch(serverAddress + '/transcribe', {
          method: 'POST',
          cache: 'no-cache',
          body: formData,
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
          })
          .then(data => {
            displayTranscriptionResult(data);
          })
          .catch(error => {
            console.error('Error fetching transcription:', error);
          });

        audioChunks = [];
      };

      startRecordingButton.addEventListener('click', function() {
        audioChunks = [];
        mediaRecorder.start();
        startRecordingButton.disabled = true;
        stopRecordingButton.disabled = false;
      });

      stopRecordingButton.addEventListener('click', function() {
        mediaRecorder.stop();
        startRecordingButton.disabled = false;
        stopRecordingButton.disabled = true;
      });
    })
    .catch(function(error) {
      console.log("error:", error);
    });
} else {
  console.log("Browser does not support audio recording");
}

document.addEventListener('DOMContentLoaded', function() {
  const logoutButton = document.getElementById('logoutButton');

  logoutButton.addEventListener('click', function() {
    
    window.location.href = '/VoxTRN-dev/index.html';
  });
});
