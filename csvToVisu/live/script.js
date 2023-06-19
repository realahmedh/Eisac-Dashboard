const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

function loadDataAndVisualize() {
    // Remove the previous chart if it exists
    d3.select("#chart svg").remove();

    // Load the CSV file using a library like d3-fetch
    d3.csv("data.csv").then(function (data) {
        // Parse the dates and convert temperatures to numbers
        const parseDate = d3.timeParse("%d/%m/%Y");
        data.forEach(function (d) {
            d.date = parseDate(d.date);
            d.temperature = +d.temperature;
        });

        // Get the last ten values
        const lastTenData = data.slice(-10);

        // Create scales for x and y axes
        const xScale = d3
            .scaleTime()
            .domain(d3.extent(lastTenData, (d) => d.date))
            .range([0, width]);

        const yScale = d3
            .scaleLinear()
            .domain([
                d3.min(lastTenData, (d) => d.temperature),
                d3.max(lastTenData, (d) => d.temperature),
            ])
            .range([height, 0]);

        // Create an SVG container for the chart
        const svg = d3
            .select("#chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create x and y axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        // Add x and y axes to the chart
        svg
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        svg.append("g").attr("class", "y-axis").call(yAxis);

        // Create a line generator
        const line = d3
            .line()
            .x((d) => xScale(d.date))
            .y((d) => yScale(d.temperature));

        // Draw the line
        svg
            .append("path")
            .datum(lastTenData)
            .attr("class", "line") // Add the "line" class for styling
            .attr("d", line);
    });
}

// Load and visualize the data initially
loadDataAndVisualize();

// Refresh the chart every 5 seconds
setInterval(loadDataAndVisualize, 5000);
