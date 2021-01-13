// console.log("Hello JS");

const kickstartePledgesURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json";
const movieSalesURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
const videoGameSalesURL =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

let kickstartePledges;
let movieSales;
let videoGameSales;

const width = 900;
const height = 600;

const treemapLayout = d3.treemap();

treemapLayout.size([width, height]).paddingOuter(0).paddingInner(0);

const consoles = {
  2600: "#072AC8",
  Wii: "#1E96FC",
  NES: "#A2D6F9",
  GB: "#FCF300",
  DS: "#FFC600",
  X360: "#B48291",
  PS3: "#A5243D",
  PS2: "#D5E1A3",
  SNES: "#E2F89C",
  GBA: "#0CF574",
  PS4: "#072AC8",
  "3DS": "#1E96FC",
  N64: "#A2D6F9",
  PS: "#FCF300",
  XB: "#B48291",
  PC: "#A5243D",
  PSP: "#D5E1A3",
  XOne: "#0CF574",
};

const makeTreemap = (root) => {
  const canvas = d3 //
    .select("#canvas");

  const tooltip = d3 //
    .select("#tooltip")
    .append("div")
    .attrs({
      class: "tooltip",
      id: "tooltip",
    });

  canvas //
    .attrs({ width, height })
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attrs((d) => {
      return {
        x: d.x0,
        y: d.y0,
        width: d.x1 - d.x0,
        height: d.y1 - d.y0,
        class: "tile",
        "data-category": d.data.category,
        "data-name": d.data.name,
        "data-value": d.data.value,
      };
    })
    .style("fill", (d) => {
      return consoles[d.data.category];
    })
    .style("visibility", (d) => {
      if (d.data.category) {
        return "visible";
      }
    })
    .on("mouseover", (d) => {
      tooltip.transition().style("visibility", "visible");
      const data = d.target["__data__"].data;
      const name = data.name;
      const value = data.value;
      console.log(data, name, value);
      tooltip
        .attr("data-value", value)
        .html(`name: ${name}/n value: ${value}`)
        .style("left", d + "px")
        .style("top", d + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().style("visibility", "hidden  ");
    });

  canvas //
    .selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("transform", (d) => {
      return `translate(${[d.x0, d.y0]})`;
    })
    .append("text")
    // .attrs({
    //   dx: 4,
    //   dy: 14,
    //   class: "name",
    // })
    // .text((d) => {
    //   return d.data.name;
    // })
    .selectAll("tspan")
    .data(function (d) {
      return d.data.name.split(/(?=[A-Z][^A-Z])/g);
    })
    .enter()
    .append("tspan")
    .attrs({
      x: 4,
      y: (d, i) => {
        return 13 + i * 10;
      },
      class: "name",
    })
    .text(function (d) {
      return d;
    });

  const legend = d3 //
    .select("#legend")
    .attrs({ width: 80, height: 300 });

  legend //
    .selectAll(".legend-item")
    .data(Object.keys(consoles))
    .enter()
    .append("rect")
    .attrs({
      x: 10,
      y: (_, i) => {
        return i * 15 + 5;
      },
      width: 10,
      height: 10,
      stroke: "black",
      class: "legend-item",
    })
    .style("fill", (d) => {
      // console.log(consoles[d]);
      return consoles[d];
    });

  legend //
    .selectAll(".legend-title")
    .data(Object.keys(consoles))
    .enter()
    .append("text")
    .attrs({
      class: "legend-title",
      x: 10,
      y: (_, i) => {
        return i * 15 + 5;
      },
      dx: 15,
      dy: 10,
    })
    .text((d) => d);
};

d3.json(videoGameSalesURL).then((data, error) => {
  if (error) console.log(error);
  else {
    const root = d3.hierarchy(data);
    root //
      .sum((d) => {
        return d.value;
      })
      .sort(function (a, b) {
        return b.height - a.height || b.value - a.value;
      });
    treemapLayout.tile(d3.treemapSquarify.ratio(1));

    treemapLayout(root);
    makeTreemap(root);
  }
});
