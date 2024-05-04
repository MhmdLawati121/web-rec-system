document.getElementById('userDashboardButton').addEventListener("click", async (event) => {
  event.preventDefault();

  const response = await fetch("/getData/sessionData");
  const data = await response.json();
  const role = data.role;
  window.location.href = `${role}/dashboard`;
})

document.addEventListener("DOMContentLoaded", function () {
  var nationalitySelect = document.getElementById("nationality");
  var countrySelect = document.getElementById("countryOfResidence");

  nationalities.forEach(function (nationality) {
    var option = document.createElement("option");
    option.text = nationality;
    nationalitySelect.add(option);
  });

  countries.forEach(function (country) {
    var option = document.createElement("option");
    option.text = country;
    countrySelect.add(option);
  });

  // DOM elements
  const saveProfileButton = document.getElementById("saveProfile");
  setupProfile();
  // Event listener for saving profile changes
  saveProfileButton.addEventListener("click", function () {
    editProfile();
  });

  async function setupProfile() {
    try {
      const response = await fetch(`/getData/getProfileData`);
      let data = await response.json();

      if (data.success) {

        data = data.data;

        // Populate form fields with fetched user and profile data
        document.getElementById("greetingFirstName").textContent = data.first_name;
        document.getElementById("greetingLastName").textContent = data.last_name;
        document.getElementById("email").value = data.email;
        /* document.getElementById("greetingFirstName").textContent = data.first_name;
        */
        document.getElementById("phone").value = data.phone;
        document.getElementById("civilId").value = data.civil_id;
        document.getElementById("firstName").value = data.first_name;
        document.getElementById("secondName").value = data.second_name;
        document.getElementById("thirdName").value = data.third_name;
        document.getElementById("lastName").value = data.last_name;
        const dobDate = new Date(data.dob);
        dobDate.setDate(dobDate.getDate() + 1);
        const dobFormatted = dobDate.toISOString().split("T")[0];
        console.log(dobFormatted);
        document.getElementById("dob").value = dobFormatted;
        document.getElementById("nationality").value = data.nationality;
        document.getElementById("countryOfResidence").value = data.country_of_residence;
        document.getElementById("maritalStatus").value = data.marital_status;
        document.getElementById("gender").value = data.gender;


      } else {
        // Log an error if fetching user details fails
        console.error("Error fetching user details:", data.message);
      }
    } catch (error) {
      // Log an error if an exception occurs during fetchUserDetails
      console.error("Error during fetchUserDetails:", error);
      // Redirect to an error page
      window.location.href = "/error.html";
    }
  }



  // Function to handle profile editing
  async function editProfile() {
    try {
      // Extracting form field values
      const newEmail = document.getElementById("email").value;
      const newCivilId = document.getElementById("civilId").value;
      const newPhone = document.getElementById("phone").value;
      const newfirstNname = document.getElementById("firstName").value;
      const newSecondName = document.getElementById("secondName").value;
      const newThirdName = document.getElementById("thirdName").value;
      const newLastName = document.getElementById("lastName").value;
      const newDob = document.getElementById("dob").value;
      const newNationality = document.getElementById("nationality").value;
      const newCountryOfResidence = document.getElementById("countryOfResidence").value;
      const newMaritalStatus = document.getElementById("maritalStatus").value;
      const newGender = document.getElementById("gender").value;



      // Perform validation
      if (
        !newEmail ||
        !newPhone ||
        !newCivilId ||
        !newfirstNname ||
        !newLastName ||
        !newDob ||
        !newNationality ||
        !newCountryOfResidence ||
        !newMaritalStatus ||
        !newGender
      ) {
        alert("Please fill out all the required fields.");
        return;
      }

      // Sending data to the server for profile update
      const response = await fetch(`/updateProfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: newfirstNname,
          second_name: newSecondName,
          third_name: newThirdName,
          last_name: newLastName,
          dob: newDob,
          nationality: newNationality,
          country_of_residence: newCountryOfResidence,
          marital_status: newMaritalStatus,
          gender: newGender,
          civil_id: newCivilId,
        }),
      });

      // Parsing the server response
      const data = await response.json();
      console.log("Data", data);

      // Handling the server response
      if (data.success) {
        // Display success message and redirect to the user dashboard
        alert("Profile updated successfully!");
        console.log("Profile updated successfully!");
      } else {
        // Display error message if profile update fails
        alert("Error updating profile");
        console.error("Error updating profile:", data.message);
      }
    } catch (error) {
      // Log an error if an exception occurs during editProfile
      console.error("Error during editProfile:", error);
    }
  }
});
