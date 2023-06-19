// Define the dimensions for the chart
const margin = { top: 20, right: 30, bottom: 30, left: 60 };
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create an SVG container for the chart
const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Handle form submission
const form = document.getElementById("dateForm");
form.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
    event.preventDefault();

    // Get the start and end dates from the form
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;

    // Pass the dates to the JavaScript function to load and visualize the data
    loadDataAndVisualize(startDate, endDate);
}

function loadDataAndVisualize(startDate, endDate) {
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

        // Filter the data based on the start and end dates
        const filteredData = data.filter(function (d) {
            return d.date >= parseDate(startDate) && d.date <= parseDate(endDate);
        });

        // Create scales for x and y axes
        const xScale = d3
            .scaleTime()
            .domain(d3.extent(filteredData, (d) => d.date))
            .range([0, width]);

        const yScale = d3
            .scaleLinear()
            .domain([
                d3.min(filteredData, (d) => d.temperature),
                d3.max(filteredData, (d) => d.temperature),
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
            .datum(filteredData)
            .attr("class", "line")
            .attr("d", line);

        // Add grid lines
        svg
            .append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0, ${height})`)
            .call(
                d3
                    .axisBottom(xScale)
                    .tickSize(-height)
                    .tickFormat("")
            );

        svg
            .append("g")
            .attr("class", "grid")
            .call(
                d3
                    .axisLeft(yScale)
                    .tickSize(-width)
                    .tickFormat("")
            );
    });
}
