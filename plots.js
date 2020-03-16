function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
  optionChanged("940")
})}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    Object.entries(result).forEach(([key, value]) => {PANEL.append("h6").text(key.toUpperCase() +": "+ value);});
    
  });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var otuIds = result.otu_ids;
    var sampleValues = result.sample_values;
    var otuLabels = result.otu_labels;

    //Bar chart
    var trance1 = {
      x: sampleValues.slice(0,10).reverse(),
      y: otuIds.slice(0,10).reverse().map(id => "OTU " + id),
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"};
    // data
    var data1 = [trance1];
    // Layout1
    var layout1 = {
      title: "<b>Top 10 Bacteria Results</b>",
      margin: {
      l: 100,
      r: 0,
      t: 100,
      b: 100
    }};
    // PLot Bar chart
    Plotly.newPlot("bar", data1, layout1);
    
    // Bubble Chart
    var trance2 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds
    }};
    //data
    var data2 = [trance2];
    // Layout
    var layout2 = {
      title: "<b>Bacteria Results</b>",
      showlegend: false,
      height: 500,
      width: 1200
    };
    // PLot
    Plotly.newPlot("bubble", data2, layout2);

    // Gauge Chart
    var metadata = data.metadata;
    var resultArray2 = metadata.filter(sampleObj => sampleObj.id == sample);
    var result2 = resultArray2[0];
    var wfreq = result2.wfreq;
    console.log(wfreq);
    var trance3 = {
      value: wfreq,
      title: { text: "<b>Button Belly Washing Frequency</b><br> Scrubs per Week"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [0,9]},
        steps: [  
          {range: [0,1], color: "#f5faf7",},
          {range: [1,2], color: "#e0f0e8"},
          {range: [2,3], color: "#cce6d9"},
          {range: [3,4], color: "#b8dbc9"},
          {range: [4,5], color: "#99ccb2"},
          {range: [5,6], color: "#7abd9c"},
          {range: [6,7], color: "#66b28c"},
          {range: [7,8], color: "#52a87d"},
          {range: [8,9], color: "#3d966e"},
        ],
      }
    }
    // data
    var data3 = [trance3];
    // Layout
    var layout3 = {
      width: 500,
      height: 450,
      margin: { t:50, b: 50 }
    }
    // PLot
    Plotly.newPlot("gauge", data3, layout3);
  })
}
init();
