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
const height = 500;

const canvas = d3 //
  .select("#canvas");

const treemapLayout = d3.treemap();

treemapLayout.size([width, height]).paddingOuter(0).paddingInner(0);
// const colors = ["#fa2600", "#ff3814", "#ff4d2e", "#ff6347", "#ff7961"];
const colors = ["red", "green", "blue", "teal", "#ff7961"];
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
  PSP: "#A5243D",
  XOne: "#D5E1A3",
};

const makeTreemap = (root) => {
  canvas //
    .attrs({ width, height })
    .selectAll("rect")
    .data(
      root.descendants().filter((d) => {
        return d.data.category;
      })
    )
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
    });

  const nodes = canvas //
    .selectAll("g")
    .data(
      root.descendants().filter((d) => {
        return d.data.category;
      })
    )
    .enter()
    .append("g")
    .attr("transform", (d) => {
      return `translate(${[d.x0, d.y0]})`;
    });

  // nodes //
  //   .append("rect")
  //   .attrs({
  //     width: (d) => {
  //       return d.x1 - d.x0;
  //     },
  //     height: (d) => {
  //       return d.y1 - d.y0;
  //     },
  //     class: "nodes",
  //   });

  nodes //
    .append("text")
    .attrs({
      dx: 4,
      dy: 14,
      class: "name",
    })
    // .attr("dx", 4)
    // .attr("dy", 14)
    // .attr("class", "name")
    .text((d) => {
      return d.data.name;
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
    root.sum((d) => {
      return d.value;
    });
    treemapLayout.tile(d3.treemapSquarify.ratio(1));

    treemapLayout(root);
    makeTreemap(root);
  }
});
