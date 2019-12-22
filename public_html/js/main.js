//test
// Picasa Web Albums plugin configuration
var picasaConfig = {

  // General Settings
  username: 'schafferlabweb',
  mode: 'albums',
  popupPlugin: "colorbox",
  colorbox_config: {
    scalePhotos: false
  },

  // Settings for Album overview
  albumThumbSize: 160,
  showAlbumdate: false,
  sortAlbums: "DESC_DATE",

  // Setting for Photo overview
  maxResults: 999,
  thumbSize: 144,
  thumbCrop: true,

  removeAlbums: ["Schaffer"]
};

// Colorbox configuration
var applyColorBox = function(className) {
  $('.' + className).colorbox( {
    rel: className,
    maxWidth: "900px",
    preloading: false,
    closeButton: false,
    current: ""
  });
};

// Takes in a list of objects and returns a HTML table (People page helper)
var makeHTMLTable = function(listOfObjects, isAlumni) {
  var cellCreator = isAlumni ? makeHTMLAlumCell : makeHTMLCell;
  var result = "<table class=\"table\">";
  for (var i = 0; i < listOfObjects.length; i++) {
    if (i % 3 == 0) { // 3 is the number of rows
      // close and start a new row
      result += "</tr><tr>";
    }
    result += cellCreator(listOfObjects[i]);
  }
  if (listOfObjects.length % 3 == 1) {
    result += "<td></td><td></td>";
  } else if (listOfObjects.length % 3 == 2) {
    result += "<td></td>";
  }
  result+= "</tr></table>";

  return result;
};

// Takes in a person and returns a HTML cell (People page helper)
var makeHTMLCell = function (person) {
  var peopleimg =   "<img src=\"img/peoplepics/" + person.firstName + "_" + person.lastName + "." + person["Img Type"] + "\"" + "onerror=\"src='img/peoplepics/placeholder.jpg';\"" + "class=\"center\" width=\"50%\">"

  var result = "<td width=\"33%\">";
  result += peopleimg
  result += "<p class=\"center\">";
  result += "<a href=\"#" + person.firstName + "_" + person.lastName + "\">" + person.lastName + ", " + person.firstName +
             ((person.Nickname) ? (" (" + person.Nickname + ")") : "") +
             "</a>";
  result += "</p></td>";
  return result;
}

// Takes in a name and returns a HTML cell in the Alumni section (People page helper)
var makeHTMLAlumCell = function(alumnus) {
  var result = "<td width=\"33%\">";
  result += "<p class=\"center\">";
  if (alumnus.Link) {
    result += "<a href=\"" + alumnus.Link + "\">" + "<strong><u>" + alumnus.Name + "</u></strong>" + "</a>"
  } else {
    result += "<strong><u>" + alumnus.Name + "</u></strong>";
  }
  if (alumnus["Former Education"]) {
    result += "<br />" + alumnus["Former Education"];
  }
  if (alumnus["Current Location"]) {
    result += "<br />" + alumnus["Current Location"];
  }
  result += "</p></td>";
  return result;
}

// Takes in a person and returns a HTML snippet (People page helper)
var makeHTMLPage = function(person) {

  var result = '<div class="container webpage" id="' + person.firstName + "_" + person.lastName + '">';
  result += '<div class="page-header">';
  result += "<img src=\"img/peoplepics/" + person.firstName + "_" + person.lastName + "." + person["Img Type"] + "\"" + "onerror=\"this.src='placeholder.jpg';\"" + "class=\"left\" style=\"max-height:50vh;\">"

  result += "<h1>" + person.firstName +
    ((person.Nickname) ? (" (" + person.Nickname + ")") : "") +
    " " + person.lastName + "</h1>";
  result += "</div>";
  result += "<p>";
  result += "<strong>" + person.Occupation + "</strong>";
  result += (person.Department)
            ? "<br /><strong>Department: </strong>" + person.Department
            : "";
  result += (person["Former Education"])
            ? "<br /><strong>Former Education: </strong>" + person["Former Education"]
            : "";
  result += (person["Project group"])
            ? "<br /><strong>Project Group: </strong>" + person["Project group"]
            : "";
  result += (person["Project supervisor"])
            ? "<br /><strong>Project Supervisor: </strong>" + "<a href=\"#" + person["Project supervisor"].replace(/\s+/g, '_') + "\">" + person["Project supervisor"] + "</a>"
            : "";
  result += (person["Project title"])
            ? "<br /><strong>Project Title: </strong>" + person["Project title"]
            : "";
  result += (person["Project description"])
            ? "<br /><br /><strong>Project Description: </strong><br />" + person["Project description"]
            : "";
  result += "</div>";
  return result;
}

// Initialize dictionary for processing of People page
var dictionaryOfPeople = {};

// Note: any person with an occupation that is not listed below will have a user page generated
// but may or may not be listed on the People page (People page generator)
var processPeoplePage = function() {
  var listOfGradStudents = [],
      listOfScientists = [],
      listOfPostdocs = [],
      listOfScholars = [],
      listOfJuniorSpecialists = [],
      listOfUndergraduates = [];

  for (var i = 0, len = listOfPeople.length, personOfInterest; i < len; i++) {
    personOfInterest = listOfPeople[i];
    dictionaryOfPeople[personOfInterest.firstName + "_" + personOfInterest.lastName] = personOfInterest;
    if (personOfInterest.Occupation == "Graduate Student") {
      listOfGradStudents.push(personOfInterest);
    } else if (personOfInterest.Occupation == "Research Scientist") {
      listOfScientists.push(personOfInterest);
    } else if (personOfInterest.Occupation == "Postdoc") {
      listOfPostdocs.push(personOfInterest);
    } else if (personOfInterest.Occupation == "Visiting Scholar") {
      listOfScholars.push(personOfInterest);
    } else if (personOfInterest.Occupation == "Junior Specialist") {
      listOfJuniorSpecialists.push(personOfInterest);
    } else if (personOfInterest.Occupation == "Undergraduate") {
      listOfUndergraduates.push(personOfInterest);
    }
  };

  var htmlToAdd;
  htmlToAdd = makeHTMLTable(listOfGradStudents);
  $("#gradstudents").append(htmlToAdd);

  htmlToAdd = makeHTMLTable(listOfScientists);
  $("#scientists").append(htmlToAdd);

  htmlToAdd = makeHTMLTable(listOfPostdocs);
  $("#postdocs").append(htmlToAdd);

  htmlToAdd = makeHTMLTable(listOfScholars);
  $("#scholars").append(htmlToAdd);

  htmlToAdd = makeHTMLTable(listOfJuniorSpecialists);
  $("#juniorspecialists").append(htmlToAdd);

  htmlToAdd = makeHTMLTable(listOfUndergraduates);
  $("#undergrads").append(htmlToAdd);

  htmlToAdd = makeHTMLTable(listOfAlumni, true);
  $("#alumni").append(htmlToAdd);


};
// User page generator
var loadHTMLPage = function(hashtext) {
  var person = dictionaryOfPeople[hashtext];
  $(".navbar-default").after(makeHTMLPage(person));
  var imageNameToFetch = person["Img Type"] ? hashtext + "." + person["Img Type"] : "placeholder.png";
  var img = $('<img class="regular" alt="" width="20%">').attr('src', 'img/People/' + imageNameToFetch)
    .load(function() {
      if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
        console.log("Uh oh!");
      }
      $("#" + hashtext).find(".page-header").after(img);
    });
};

// Processes the active page
var processActivePage = function(hashtext) {
  $(".webpage").hide();
  $(".nav.navbar-nav li").removeClass('active');

  hashtext = hashtext || window.location.hash.substring(1) || "home";

  if (hashtext.indexOf("_") > -1) {
    if ($("#" + hashtext).length != 0) {
      $("#" + hashtext).fadeIn();
    } else { // need to generate HTML page plus fetch image
      loadHTMLPage(hashtext);
    };
    return;
  }

  $("#" + hashtext).fadeIn();
  $("#nav" + hashtext).addClass('active');
}

// Code that gets executed after the DOM is ready
$(document).ready(function(){

  // Set up Publications accordion
  $( "#accordion" ).accordion({ heightStyle: "content", collapsible: true });

  // Set up People page
  processPeoplePage();

  // Respond to changes in the URL hash
  $(window).hashchange( function() {
    processActivePage();
  } );

  // Set up support for Picasa Web Albums
  picasaConfig["onAlbumsEnd"] = function() {
    setTimeout(processActivePage, 0);
  };
  $("#albums").pwi(picasaConfig);

  // Set up the carousels
  $(".owl-carousel").owlCarousel({
    items : 3,
    lazyLoad : true
  });

  // Set up the Colorboxes associated with the carousels' images
  $('.group1').colorbox( {
    rel: 'group1',
    maxWidth: "900px",
    preloading: false,
    closeButton: false,
    current: ""
  });

  applyColorBox('group1');
  applyColorBox('group2');
  applyColorBox('group3');

});
