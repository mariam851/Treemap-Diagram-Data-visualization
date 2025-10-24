
const width = 960;
const height = 570;

const svg = d3.select("#treemap");
const tooltip = d3.select("#tooltip");

const color = d3.scaleOrdinal(d3.schemeCategory10);

d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")
  .then(data => {
    const root = d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

    d3.treemap()
      .size([width, height])
      .paddingInner(1)
      (root);

    const tile = svg.selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

    tile.append("rect")
      .attr("class", "tile")
      .attr("data-name", d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d => d.data.value)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => color(d.data.category))
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(
            "Name: " + d.data.name + "<br>" +
            "Category: " + d.data.category + "<br>" +
            "Value: " + d.data.value
          )
          .attr("data-value", d.data.value)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    tile.append("text")
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter()
      .append("tspan")
      .attr("x", 4)
      .attr("y", (d, i) => 12 + i * 10)
      .text(d => d)
      .attr("font-size", "10px")
      .attr("fill", "black");

    const categories = [...new Set(root.leaves().map(d => d.data.category))];
    const legend = d3.select("#legend");

    categories.forEach(category => {
      const entry = legend.append("div").attr("class", "legend-entry");

      entry.append("div")
        .attr("class", "legend-item")
        .style("background-color", color(category));

      entry.append("span").text(category);
    });
  });
