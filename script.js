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
})}
  
init();
buildMetadata(940);
buildCharts(940);


function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}


function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      // Extract Metadat info for each selected candidate
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);  
      var PANEL = d3.select("#sample-metadata");
      
      PANEL.html("");

      // Print candidate Metadat info in the panel on webpage
      Object.entries(resultArray[0]).forEach(([key, value]) =>
      {
        PANEL.append("h6").text(key + ': ' + value);
        });
      
    });
}
function buildCharts(sample) {
    d3.json("samples.json").then((data) => {

      // Filter values for each sample object.
      var samplesArray = data.samples.filter(sampleObj => sampleObj.id == sample); 

      // Obtain WFreq for the sample object for the guage chart
      var metaArray = data.metadata.filter(sampleObj => sampleObj.id == sample);  
      var wkly_freq=metaArray[0].wfreq;
   
      // Obtain array of OTU ID for the sample object
      var sample_otu=samplesArray[0].otu_ids;
      // Obtain array of Sample Values for the sample object
      var sample_num=samplesArray[0].sample_values;
      // Obtain array of OTU Labels for the sample array selected
      var labels=samplesArray[0].otu_labels;

      // Create an array for sorting and slicing the top 10 samples
      var result = [];
      sample_otu.forEach((key, i) => result.push([key, sample_num[i], labels[i]]));

      // Sort OTUs by their sample size
      var sortedSamples = result.sort((a,b) => b[1] - a[1]); 

     // Obtain the top ten OTUs by sample size
     var topTen = sortedSamples.slice(0,10);

     var x_axis=[];
     var y_axis=[];
     var top_labels=[];

     Object.entries(topTen).forEach(([key, value]) =>
     {
        x_axis.push('OTU '+value[0]);
        y_axis.push(value[1]);
        top_labels.push(value[2]);

     });

     // Bar Chart
     var trace = {
        x: y_axis.reverse(),
        y: x_axis.reverse(),
        text: top_labels.reverse(),
        orientation: 'h',
        marker: {
        color: '#ff842a'
        },
        type: "bar"
      };

      var layout = {
        title: {
            text: "<b>Top 10 Samples</b>",
            font: {
                family: 'Arial',
                size: 26
              },
            }
      }

      Plotly.newPlot("bar", [trace], layout);

      // Bubble Chart

      var trace1 = {
        x: sample_otu,
        y: sample_num,
        text: labels,
        mode: 'markers',
        marker: {
          size: sample_num,
          color: sample_otu,
          sizeref: 1,
          colorscale: 'YIGnBu'
        },
        type: "scatter"
      }

      var layout1 = {
        showlegend: false,
        plot_bgcolor:"#edf0f2",
        paper_bgcolor:"white",
        height: 800,
        width: 1500,
        title: {
            text: "<b>Sample size by OTU for candidate id: </b>" + sample,
            font: {
                family: 'Arial',
                size: 26
              }
        },
    
        xaxis: {
          zeroline: false,
          title: "<b>OTU ID</b>",
          font: {
            family: 'Arial',
            size: 20,
            color: '#7f7f7f'
          },
          gridcolor: 'white',
        },
        yaxis: {
          rangemode: 'nonnegative',
          zeroline: false,
          title: "<b># of samples</b>",
          font: {
            family: 'Arial',
            size: 20,
            color: '#7f7f7f'
          },
          gridcolor: 'white',
        }
     };
    
     Plotly.newPlot("bubble", [trace1], layout1);

     // Create a guage chart for weekly wash frequency
      var trace2 = {
            value: wkly_freq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [0, 9], tickwidth: 1, tickcolor: "black" },
                bar: { color: "#9e3744"},
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "grey",
                steps: [
                  {range: [0,1], color: "#f83e74",},
                  {range: [1,2], color: "#e83e74"},
                  {range: [2,3], color: "#c83e74"},
                  {range: [3,4], color: "#b83e74"},
                  {range: [4,5], color: "#983e74"},
                  {range: [5,6], color: "#783e74"},
                  {range: [6,7], color: "#683e74"},
                  {range: [7,8], color: "#583e74"},
                  {range: [8,9], color: "#383e74"},
                ],
              },
              
        };
    
        var layout2 = {
            width: 500,
            height: 400,
            margin: { t: 10, r: 10, l: 10, b: 10 },
            paper_bgcolor: "#fed65e",
            font: {
                color: "",
                family: "Arial",
                size: 18
            }
          };
      
      Plotly.newPlot('gauge', [trace2], layout2);



    });
}

