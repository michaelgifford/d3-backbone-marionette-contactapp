ContactManager.module("ContactsApp.Gender", function(Gender, ContactManager, Backbone, Marionette, $, _){
  Gender.Controller = {
    showGender: function() {
      var female = []; //initialize genders and gender counts
      var male = [];
      var other = [];
      var femaleNum = 0;
      var maleNum = 0;
      var otherNum = 0;

      var fetchingContact = ContactManager.request("contact:entities"); //fetch contacts
      var genderView = new Gender.ShowGender(); //create view for graph

      $.when(fetchingContact).done(function(fetchedContacts){
        var contactArray = fetchedContacts.toArray(); //place fetched contacts in array when fetching is completed

        contactArray.forEach((contact) => { //split fetched contacts to male/female/other
          if(String(contact.attributes.gender).toLowerCase() === "female") {
            female.push(contact.attributes.gender);
          } else if (String(contact.attributes.gender).toLowerCase() === "male") {
            male.push(contact.attributes.gender);
          } else {
            other.push(contact.attributes.gender);
          };
        });

        femaleNum = female.length; //set counts of genders
        maleNum = male.length;
        otherNum = other.length;
      });

      var dataset = [ //put counts into dataset for d3
        {label: 'Male', count: maleNum},
        {label: 'Female', count: femaleNum},
        {label: 'Other', count: otherNum}
      ];

      var width = 360; //set donut chart attributes
      var height = 360;
      var radius = Math.min(width, height) / 2;
      var donutWidth = 75;
      var legendRectSize = 18;
      var legendSpacing = 4;
      var color = d3.scaleOrdinal(d3.schemeCategory10);

      var svg = d3.select("#gender-graph") //create svg for donut chart
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append('g')
      .attr('transform', 'translate(' + (width / 2) +
      ',' + (height / 2) + ')');

      var arc = d3.arc() //define arc for donut chart
      .innerRadius(radius - donutWidth)
      .outerRadius(radius);

      var pie = d3.pie() //define pie for donut chart
      .value(function(d) { return d.count; })
      .sort(null);

      var path = svg.selectAll('path') //create path for donut chart
      .data(pie(dataset))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d, i) {
        return color(d.data.label);
      });

      var legend = svg.selectAll('.legend') //create legend for chart
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var height = legendRectSize + legendSpacing;
        var offset =  height * color.domain().length / 2;
        var horz = -2 * legendRectSize;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
      });

      legend.append('rect') //define legend's area
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color);

      legend.append('text') //fill legend with text
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function(d) {
        if (d == "Male") {
          return d + ' (' + maleNum + ')';
        } else if(d == "Female") {
          return d + ' (' + femaleNum + ')';
        }  else {
          return d + ' (' + otherNum + ')';
        }
      });

      ContactManager.regions.main.show(genderView);
    }
  };
});
