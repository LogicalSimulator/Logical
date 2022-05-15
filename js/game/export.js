"use strict";

const pls_compress = true;

const component_indices = [
  AndGate,
  BufferGate,
  NandGate,
  NorGate,
  NotGate,
  OrGate,
  XnorGate,
  XorGate,
  FourBitDigit,
  EightBitDigit,
  Button,
  Clock,
  TrueConstant,
  FalseConstant,
  Light,
  Switch
];

function get_component_type(comp) {
  for (let i = 0; i < component_indices.length; i ++) {
    if (comp instanceof component_indices[i]) {
      return i;
    }
  }
  return -1;
}

function get_component_index(comp, all_comps) {
  for (let i = 0; i < all_comps.length; i ++) {
    if (comp === all_comps[i]) {
      return i;
    }
  }
  return undefined;
}

function get_component_output_connect_point_names(comp) {
  const points = [];
  for (let i = 1; ; i ++) {
    const attr = "output" + i;
    if (comp[attr] != undefined) {
      points.push(attr);
    } else {
      break;
    }
  }
  return points;
}

function vector_to_json(vec) {
  return {
    "x": vec.x,
    "y": vec.y
  };
}

function json_to_vector(json) {
  return createVector(json["x"], json["y"]);
}

function export_game(conns, conn_pts, comps) {
  let id = 0;
  for (const group of [conns, conn_pts, comps]) {
    for (const item of group) {
      item.id = id;
      id ++;
    }
  }

  const json_comps = [];

  for (const comp of comps) {
    const json_conn_pts = {};

    const conn_out_pt_names = get_component_output_connect_point_names(comp);

    for (const name of conn_out_pt_names) {
      const json_out_conns = [];
      for (const conn of comp[name].connections) {
        if (conn == undefined) {
          continue;
        }
        const json_out_conn = {
          "id": get_component_index(conn.to_point.parent, comps),
          "name": conn.to_point.set_name.replace("_state", "")
        };
        json_out_conns.push(json_out_conn);
      }
      json_conn_pts[name] = json_out_conns;
    }
    
    const json_comp = {
      "id": comp.id,
      "type": get_component_type(comp),
      "pos": vector_to_json(comp.pos),
      "angle": comp.angle,
      "out_connect_points": json_conn_pts
    };
    json_comps.push(json_comp);
  }
  
  const json_state = {
    "product": product,
    "version": version,
    "state": {
      "components": json_comps
    }
  };
  return JSON.stringify(json_state);
}

function import_game(s) {
  const json_obj = JSON.parse(s);
  if (json_obj["product"] !== product) {
    console.error("Incorrect product: " + json_obj["product"] + " != " + product);
    return;
  }
  if (json_obj["version"] !== version) {
    console.warn("Different version: " + json_obj["version"] + " != " + version);
  }
  const json_state = json_obj["state"];
  const json_comps = json_state["components"];

  const connections = [];
  const connection_points = [];
  const components = [];
  
  for (const json_comp of json_comps) {
    const new_comp = new component_indices[json_comp["type"]](json_to_vector(json_comp["pos"]));
    new_comp.id = json_comp["id"];
    new_comp.angle = json_comp["angle"];
    components.push(new_comp);
  }
  
  return {
    "connections": connections,
    "connection_points": connection_points,
    "components": components
  };
}