const serverAddress = 'https://3.130.175.176.nip.io';
document.addEventListener('DOMContentLoaded', function() {
    const NextButton = document.querySelector(".form-button");
    const Password = document.querySelector("#txtPassword");
    const Username = document.querySelector(".form-control");
  
    NextButton.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the form from submitting
  
      const usernameValue = Username.value.trim();
      const passwordValue = Password.value.trim();
  
      // Check if the username and password meet the required criteria
      if ((usernameValue === 'demouser1' && passwordValue === 'pwd123') || 
          (usernameValue === 'demouser2' && passwordValue === 'pwd247')) {
        // Redirect to the dashboard page
        window.location.href = serverAddress + "/dashboard";
      } else {
        alert('Invalid username or password. Please try again.');
      }
    });
  
    const Checkbox = document.querySelector("#show");
  
    Checkbox.addEventListener('click', function() {
      const type = Password.getAttribute("type") === "password" ? "text" : "password";
      Password.setAttribute("type", type);
    });
  });
  