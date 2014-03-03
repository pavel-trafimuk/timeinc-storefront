(function() {
  var tests = {},
      assignments = JSON.parse(localStorage.ABTestAssignments || "{}");

  function randInt(n) {
    return Math.floor(Math.random()*n);
  }
  function randomSelect(arr) {
    return arr[ randInt(arr.length) ];
  }
  function AB(test_name, variations) {
    if (variations !== undefined) {
      tests[test_name] = variations;
    }
    if (test_name in assignments) {
      return tests[test_name][assignments[test_name]];
    }

    assignments[test_name] = randomSelect(Object.keys(variations));
    AB.save();
    
    return AB(test_name);
  }
  AB.save = function() {
    localStorage.ABTestAssignments = JSON.stringify(assignments);
  }
  AB.omnitureString = function() {
    return Object.keys(tests).map(function(test_name) {
      return test_name + ":" + assignments[test_name];
    }).join("|");
  }
  AB.reset = function() {
    assignments = {};
    Object.keys(tests).forEach(function(test_name) {
      AB(test_name, tests[test_name]);
    });
  }

  window.AB = AB;
})();


/*
Usage:
  > // Configure it like so:
  > AB("title", {
      "InThisIssue": "In This Issue:",
      "EditorsPicks": "Preview Editor's Picks:"
    });

  "In This Issue:"

  > // Look up the values in code later:
  > AB("title");

  "In This Issue:"  

  > // Set up a couple more tests
  > AB("buttonColor", {
      "red": "#c00",
      "blue": "#00c"
    });

  "#c00"

  > AB("alert", {
      'native': alert,
      'custom': function() {
        // ...
      }
    });

  function(){...}
  
  > // the alert test has a function as a value, so in
  > // code, let's also call it right away
  > AB("alert")("Testing the alert"); // pops up an alert

  undefined

  > // this will be passed with every omniture call and
  > // loaded into a "listvar"
  > AB.omnitureString();

  "title:InThisIssue|buttonColor:red|alert:native"

  > AB("buttonColor");

  "#c00"

  > // During development, you can use AB.reset() to
  > // clear out the AB tests and get a new random 
  > // selection of test assignments
  > AB.reset();

  undefined

  > AB.omnitureString();

  ""

*/