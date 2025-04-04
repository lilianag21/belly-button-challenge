// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field

    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number

    let filteredResult = metadata.find(obj => obj.id == +sample);

    // Use d3 to select the panel with id of `#sample-metadata`

    let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata

    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.

    Object.entries(filteredResult).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field

    let samples = data.samples;

    // Filter the samples for the object with the desired sample number

    let filteredResult = samples.find(obj => obj.id == sample);

    // Get the otu_ids, otu_labels, and sample_values

    let otu_ids = filteredResult.otu_ids;
    let otu_labels = filteredResult.otu_labels;
    let sample_values = filteredResult.sample_values;
 
    // Build a Bubble Chart

    let bubbleOutline = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
        }
    };

    // Render the Bubble Chart

    let bubbleDetails = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"},
      hovermode: "closest"
    };

    Plotly.newPlot("bubble", [bubbleOutline], bubbleDetails);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks

    let topOtuIds = otu_ids.slice(0, 10).reverse();
    let topSampleValues = sample_values.slice(0, 10).reverse();
    let topOtuLabels = otu_labels.slice(0, 10).reverse();
    let yticks = topOtuIds.map(id => `OTU ${id}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately

    let barOutline = {
      x: topSampleValues,
      y: yticks,
      text: topOtuLabels,
      type: "bar",
      orientation: "h"
    };

    let barDetails = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 40, l: 70 },
      xaxis: {title: "Number of Bacteria"}
    };


    // Render the Bar Chart

    Plotly.newPlot("bar", [barOutline], barDetails);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field

    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`

    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    names.forEach((sample) => {
      dropdown.append("option")
        .text(sample)
        .property("value", sample);
    })

    // Get the first sample from the list

    let newSample = names[0];

    // Build charts and metadata panel with the first sample

    buildCharts(newSample);
    buildMetadata(newSample);
  
    dropdown.on("change", function() {
      let newSample = d3.select(this).property("value");
      optionChanged(newSample);
    });

  });
}


// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected

  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

